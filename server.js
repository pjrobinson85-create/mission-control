#!/usr/bin/env node

/**
 * Mission Control Local Server
 * Lightweight Node.js server powering the Mission Control dashboard
 * Port: 8899
 * No external dependencies - uses only built-in Node modules
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = 8899;
const HOST = '0.0.0.0';  // Listen on all network interfaces
const DATA_FILE = path.join(__dirname, 'mc-data.json');
const ACTIVITY_FILE = path.join(__dirname, 'mc-activity.json');
const HTML_FILE = path.join(__dirname, 'mission-control.html');

// Server startup timestamp
const SERVER_START_TIME = Date.now();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse JSON safely
 */
function parseJSON(data, defaultValue = null) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return defaultValue;
    }
}

/**
 * Read file safely
 */
function readFile(filePath, defaultValue = null) {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultValue;
        }
        return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
        return defaultValue;
    }
}

/**
 * Write file safely
 */
function writeFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`Error writing ${filePath}:`, e.message);
        return false;
    }
}

/**
 * Get MIME type for file extension
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
    };
    return mimeTypes[ext] || 'text/plain';
}

/**
 * Format uptime
 */
function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Log activity
 */
function logActivity(type, message, metadata = {}) {
    try {
        let activity = readFile(ACTIVITY_FILE, '[]');
        activity = parseJSON(activity, []);

        const entry = {
            id: `a${Date.now()}`,
            type,
            message,
            timestamp: new Date().toISOString(),
            ...metadata
        };

        activity.push(entry);

        // Keep last 500 entries
        if (activity.length > 500) {
            activity = activity.slice(-500);
        }

        writeFile(ACTIVITY_FILE, activity);
    } catch (e) {
        console.error('Error logging activity:', e.message);
    }
}

// =============================================================================
// API ENDPOINT HANDLERS
// =============================================================================

/**
 * GET /mc/status
 * Returns server status and health info
 */
function handleStatus(res) {
    const uptime = Date.now() - SERVER_START_TIME;
    const status = {
        success: true,
        server: 'online',
        uptime: formatUptime(uptime),
        uptimeMs: uptime,
        lastRefresh: new Date().toISOString(),
        connection: 'healthy',
        version: '1.0.0',
        port: PORT,
        timestamp: Date.now()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
    logActivity('api_call', 'GET /mc/status', { endpoint: 'status' });
}

/**
 * GET /mc/data
 * Returns dashboard data from mc-data.json
 */
function handleGetData(res) {
    const dataContent = readFile(DATA_FILE, '{}');
    const data = parseJSON(dataContent, {});

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    logActivity('api_call', 'GET /mc/data', { endpoint: 'data' });
}

/**
 * POST /mc/data
 * Save dashboard data to mc-data.json
 */
function handlePostData(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = parseJSON(body, {});
            const success = writeFile(DATA_FILE, data);

            if (success) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Data saved' }));
                logActivity('data_save', 'Dashboard data synchronized', {
                    endpoint: 'data',
                    dataSize: body.length
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to save data' }));
            }
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    });
}

/**
 * GET /mc/weather?city=Gold%20Coast,QLD
 * Fetch weather from wttr.in API
 */
function handleWeather(req, res, queryParams) {
    const city = queryParams.city || 'Gold Coast,QLD';

    // Fetch from wttr.in
    const weatherUrl = `http://wttr.in/${encodeURIComponent(city)}?format=j1`;

    const weatherReq = http.get(weatherUrl, (weatherRes) => {
        let weatherData = '';

        weatherRes.on('data', chunk => {
            weatherData += chunk;
        });

        weatherRes.on('end', () => {
            try {
                const parsed = parseJSON(weatherData, null);

                if (!parsed || !parsed.current_condition) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to parse weather data' }));
                    return;
                }

                const current = parsed.current_condition[0];
                const weather = {
                    city,
                    temperature: current.temp_C,
                    condition: current.weatherDesc?.[0]?.value || 'Unknown',
                    feelsLike: current.FeelsLikeC,
                    humidity: current.humidity,
                    windSpeed: current.windspeedKmph,
                    timestamp: new Date().toISOString()
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(weather));
                logActivity('api_call', `GET /mc/weather (${city})`, { endpoint: 'weather' });
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
    });

    weatherReq.on('error', (e) => {
        console.error('Weather API error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch weather' }));
    });
}

/**
 * GET /mc/activity
 * Returns recent activity log (last 50 entries)
 */
function handleGetActivity(res) {
    const activityContent = readFile(ACTIVITY_FILE, '[]');
    const activity = parseJSON(activityContent, []);

    // Return last 50 entries
    const recent = activity.slice(-50);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(recent));
    logActivity('api_call', 'GET /mc/activity', { endpoint: 'activity' });
}

/**
 * POST /mc/activity
 * Add activity entry
 */
function handlePostActivity(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const entry = parseJSON(body, {});
            let activity = readFile(ACTIVITY_FILE, '[]');
            activity = parseJSON(activity, []);

            const newEntry = {
                id: `a${Date.now()}`,
                message: entry.message || '',
                type: entry.type || 'custom',
                timestamp: new Date().toISOString(),
                ...entry
            };

            activity.push(newEntry);

            // Keep last 500 entries
            if (activity.length > 500) {
                activity = activity.slice(-500);
            }

            const success = writeFile(ACTIVITY_FILE, activity);

            if (success) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, id: newEntry.id }));
                logActivity('activity_log', entry.message || 'Activity logged', { type: entry.type });
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to log activity' }));
            }
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    });
}

/**
 * Serve static file
 */
function serveFile(filePath, res) {
    try {
        const content = fs.readFileSync(filePath);
        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
    } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
    }
}

// =============================================================================
// REQUEST ROUTER
// =============================================================================

/**
 * Handle /mc/tasks - return live task data
 */
function handleTasks(res) {
    try {
        const tasksFile = path.join(__dirname, 'tasks.json');
        const tasksStr = readFile(tasksFile, '{}');
        const tasksData = tasksStr ? JSON.parse(tasksStr) : { projects: [], tasks: [] };
        const response = {
            success: true,
            data: tasksData,
            timestamp: new Date().toISOString()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (e) {
        console.error('Error reading tasks:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error reading tasks' }));
    }
}

/**
 * Handle /mc/health - return medication, bowel, stress, focus state
 */
function handleHealth(res) {
    try {
        const medication = JSON.parse(readFile(path.join(__dirname, 'medication-state.json'), '{}'));
        const bowel = JSON.parse(readFile(path.join(__dirname, 'bowel-schedule.json'), '{}'));
        const stress = JSON.parse(readFile(path.join(__dirname, 'stress-tracking.json'), '{}'));
        const focus = JSON.parse(readFile(path.join(__dirname, 'focus-state.json'), '{}'));
        
        const response = {
            success: true,
            data: {
                medication,
                bowel,
                stress,
                focus
            },
            timestamp: new Date().toISOString()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (e) {
        console.error('Error reading health data:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error reading health data' }));
    }
}

/**
 * Handle /mc/blocker - return critical blockers analysis
 */
function handleBlocker(res) {
    try {
        const tasksFile = path.join(__dirname, 'tasks.json');
        const tasksStr = readFile(tasksFile, '{}');
        const tasksData = tasksStr ? JSON.parse(tasksStr) : { projects: [], tasks: [] };
        
        // Find blocked tasks
        const blocked = tasksData.tasks.filter(t => t.status === 'blocked');
        
        // Calculate age of each blocker
        const blockers = blocked.map(task => {
            const now = new Date();
            const created = task.created_date ? new Date(task.created_date) : now;
            const age = Math.floor((now - created) / (1000 * 60 * 60 * 24)); // days
            
            return {
                id: task.id,
                title: task.title,
                project: task.project,
                reason: task.blocked_reason || 'No reason specified',
                dependsOn: task.depends_on || null,
                daysBlocked: age,
                priority: task.priority,
                notes: task.notes
            };
        });
        
        const response = {
            success: true,
            data: {
                totalBlocked: blockers.length,
                blockers: blockers.sort((a, b) => b.daysBlocked - a.daysBlocked),
                criticalCount: blockers.filter(b => b.priority === 'critical').length
            },
            timestamp: new Date().toISOString()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (e) {
        console.error('Error analyzing blockers:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error analyzing blockers' }));
    }
}

function handleRequest(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Route API endpoints
    if (pathname === '/mc/status' && req.method === 'GET') {
        handleStatus(res);
    } else if (pathname === '/mc/data' && req.method === 'GET') {
        handleGetData(res);
    } else if (pathname === '/mc/data' && req.method === 'POST') {
        handlePostData(req, res);
    } else if (pathname === '/mc/weather' && req.method === 'GET') {
        handleWeather(req, res, query);
    } else if (pathname === '/mc/activity' && req.method === 'GET') {
        handleGetActivity(res);
    } else if (pathname === '/mc/activity' && req.method === 'POST') {
        handlePostActivity(req, res);
    } else if (pathname === '/mc/tasks' && req.method === 'GET') {
        handleTasks(res);
    } else if (pathname === '/mc/health' && req.method === 'GET') {
        handleHealth(res);
    } else if (pathname === '/mc/blocker' && req.method === 'GET') {
        handleBlocker(res);
    }
    // Serve static files
    else if (pathname === '/' || pathname === '/mission-control.html') {
        serveFile(HTML_FILE, res);
    } else {
        // Try to serve as static file
        const filePath = path.join(__dirname, pathname);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            serveFile(filePath, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Not Found');
        }
    }
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
    // Get local IP addresses
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let lanIp = 'localhost';
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                lanIp = iface.address;
                break;
            }
        }
        if (lanIp !== 'localhost') break;
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  🚀 Mission Control Server Started');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Local:     http://localhost:${PORT}`);
    console.log(`  LAN:       http://${lanIp}:${PORT}`);
    console.log(`  Port:      ${PORT}`);
    console.log(`  Status:    ✓ Online`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n  API Endpoints:');
    console.log('    GET  /mc/status           — Server status');
    console.log('    GET  /mc/data             — Read dashboard data');
    console.log('    POST /mc/data             — Save dashboard data');
    console.log('    GET  /mc/weather?city=... — Fetch weather');
    console.log('    GET  /mc/activity         — Activity log (last 50)');
    console.log('    POST /mc/activity         — Log activity entry');
    console.log('\n  Data Files:');
    console.log(`    ${DATA_FILE}`);
    console.log(`    ${ACTIVITY_FILE}`);
    console.log('\n  Press Ctrl+C to stop\n');

    logActivity('server_start', 'Mission Control Server started', { port: PORT });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n  Shutting down...');
    logActivity('server_stop', 'Mission Control Server stopped');
    server.close(() => {
        console.log('  ✓ Server closed\n');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    logActivity('server_stop', 'Mission Control Server stopped');
    server.close(() => {
        process.exit(0);
    });
});
