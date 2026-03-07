#!/usr/bin/env node

/**
 * Get YouTube/TikTok/Instagram transcript using Supadata API
 * Usage: node get-transcript.js <URL> [output-file]
 */

const https = require('https');
const fs = require('fs');

const API_KEY = 'sd_a9fd20d41db3dcc20a9f7f13a0050e15';
const API_URL = 'https://api.supadata.ai/v1/transcript';

const videoUrl = process.argv[2];
const outputFile = process.argv[3];

if (!videoUrl) {
    console.error('Usage: node get-transcript.js <VIDEO_URL> [output-file]');
    console.error('Example: node get-transcript.js https://youtu.be/Vfk9dO5Ak3s output.txt');
    process.exit(1);
}

async function getTranscript(url) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({ url });
        const requestUrl = `${API_URL}?${params}`;
        
        console.log(`Fetching transcript for: ${url}`);
        
        https.get(requestUrl, {
            headers: {
                'x-api-key': API_KEY,
                'User-Agent': 'Mozilla/5.0'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${e.message}`));
                    }
                } else {
                    reject(new Error(`API error (${res.statusCode}): ${data}`));
                }
            });
        }).on('error', reject);
    });
}

function formatTranscript(data) {
    if (data.text) {
        // Plain text format
        return data.text;
    } else if (data.transcript && Array.isArray(data.transcript)) {
        // Timestamped format
        return data.transcript.map(item => 
            `[${item.timestamp || '0:00'}] ${item.text}`
        ).join('\n');
    } else if (typeof data === 'string') {
        return data;
    } else {
        return JSON.stringify(data, null, 2);
    }
}

(async () => {
    try {
        const result = await getTranscript(videoUrl);
        const formatted = formatTranscript(result);
        
        if (outputFile) {
            fs.writeFileSync(outputFile, formatted, 'utf-8');
            console.log(`✓ Transcript saved to: ${outputFile}`);
        } else {
            console.log('\n=== TRANSCRIPT ===\n');
            console.log(formatted);
        }
    } catch (error) {
        console.error(`✗ Error: ${error.message}`);
        process.exit(1);
    }
})();
