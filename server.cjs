#!/usr/bin/env node

/**
 * Mission Control Server
 * Lightweight Node.js server for persisting dashboard state
 * 
 * Usage: node server.js
 * Port: 8899
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8899;
const DATA_FILE = path.join(__dirname, 'unified-tasks.json');
const ACTIVITY_FILE = path.join(__dirname, 'mc-activity.json');
const SERVER_START = Date.now();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Log with timestamp
 */
function log(msg, level = 'INFO') {
    const time = new Date().toISOString();
    console.log(`[${time}] ${level}: ${msg}`);
}

/**
 * Send JSON response
 */
function sendJSON(res, data, status = 200) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

/**
 * Read unified tasks file
 */
function readTasksFile() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(content);
        }
        return {};
    } catch (e) {
        log(`Error reading tasks file: ${e.message}`, 'ERROR');
        return {};
    }
}

/**
 * Write unified tasks file
 */
function writeTasksFile(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        log(`Error writing tasks file: ${e.message}`, 'ERROR');
        return false;
    }
}

/**
 * Read activity log
 */
function readActivityFile() {
    try {
        if (fs.existsSync(ACTIVITY_FILE)) {
            const content = fs.readFileSync(ACTIVITY_FILE, 'utf-8');
            return JSON.parse(content);
        }
        return { entries: [], lastUpdated: Date.now() };
    } catch (e) {
        log(`Error reading activity file: ${e.message}`, 'ERROR');
        return { entries: [], lastUpdated: Date.now() };
    }
}

/**
 * Write activity log
 */
function writeActivityFile(data) {
    try {
        // Keep only last 500 entries
        if (data.entries && data.entries.length > 500) {
            data.entries = data.entries.slice(-500);
        }
        data.lastUpdated = Date.now();
        fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (e) {
        log(`Error writing activity file: ${e.message}`, 'ERROR');
        return false;
    }
}

/**
 * Log activity entry
 */
function logActivity(action, details = '') {
    try {
        const activity = readActivityFile();
        activity.entries.push({
            timestamp: Date.now(),
            action,
            details,
            date: new Date().toISOString()
        });
        writeActivityFile(activity);
    } catch (e) {
        log(`Error logging activity: ${e.message}`, 'ERROR');
    }
}

/**
 * Fetch weather from wttr.in
 */
async function fetchWeather(city = 'Gold Coast,QLD') {
    try {
        const encodedCity = encodeURIComponent(city);
        const res = await new Promise((resolve, reject) => {
            http.get(`http://wttr.in/${encodedCity}?format=j1`, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });
        
        const current = res.current_condition[0];
        return {
            temp: current.temp_C,
            condition: current.weatherDesc[0].value,
            humidity: current.humidity,
            windKph: current.windspeedKmph,
            feelsLike: current.FeelsLikeC,
            city,
            timestamp: Date.now()
        };
    } catch (e) {
        log(`Weather fetch failed: ${e.message}`, 'WARN');
        return { error: 'Failed to fetch weather' };
    }
}

// ============================================================================
// REQUEST HANDLER
// ============================================================================

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    log(`${req.method} ${pathname}`);

    // ========================================================================
    // ROUTES
    // ========================================================================

    // GET /mc/status - Server health
    if (pathname === '/mc/status' && req.method === 'GET') {
        const uptime = Date.now() - SERVER_START;
        sendJSON(res, {
            status: 'online',
            uptime,
            timestamp: Date.now(),
            version: '1.0',
            dataFile: DATA_FILE,
            activityFile: ACTIVITY_FILE
        });
        logActivity('status_check');
        return;
    }

    // GET /mc/data - Read tasks from unified file
    if (pathname === '/mc/data' && req.method === 'GET') {
        const data = readTasksFile();
        sendJSON(res, data);
        logActivity('data_read', 'Dashboard data loaded');
        return;
    }

    // POST /mc/data - Write tasks to unified file
    if (pathname === '/mc/data' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const success = writeTasksFile(data);
                if (success) {
                    sendJSON(res, { success: true, message: 'Data saved to unified-tasks.json' });
                    logActivity('data_saved', 'Dashboard state persisted');
                } else {
                    sendJSON(res, { success: false, error: 'Failed to write file' }, 500);
                }
            } catch (e) {
                sendJSON(res, { success: false, error: e.message }, 400);
            }
        });
        return;
    }

    // GET /mc/weather - Fetch live weather
    if (pathname === '/mc/weather' && req.method === 'GET') {
        const city = query.city || 'Gold Coast,QLD';
        const weather = await fetchWeather(city);
        sendJSON(res, weather);
        logActivity('weather_fetched', city);
        return;
    }

    // GET /mc/activity - Read activity log
    if (pathname === '/mc/activity' && req.method === 'GET') {
        const activity = readActivityFile();
        const limit = query.limit ? parseInt(query.limit) : 50;
        const entries = activity.entries.slice(-limit);
        sendJSON(res, { entries, total: activity.entries.length });
        return;
    }

    // POST /mc/activity - Log activity entry
    if (pathname === '/mc/activity' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { action, details } = JSON.parse(body);
                logActivity(action, details);
                sendJSON(res, { success: true });
            } catch (e) {
                sendJSON(res, { success: false, error: e.message }, 400);
            }
        });
        return;
    }

    // 404
    sendJSON(res, { error: 'Not found' }, 404);
});

// ============================================================================
// STARTUP
// ============================================================================

server.listen(PORT, () => {
    log(`Mission Control Server started on http://localhost:${PORT}`);
    log(`Data file: ${DATA_FILE}`);
    log(`Activity log: ${ACTIVITY_FILE}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    log('Shutting down gracefully...', 'INFO');
    server.close(() => {
        log('Server closed', 'INFO');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down...', 'INFO');
    server.close(() => {
        log('Server closed', 'INFO');
        process.exit(0);
    });
});

// Log errors
process.on('uncaughtException', (err) => {
    log(`Uncaught Exception: ${err.message}`, 'ERROR');
    process.exit(1);
});
