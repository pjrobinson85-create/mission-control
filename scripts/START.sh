#!/bin/bash

# Kill any existing server
pkill -f "node server.js" 2>/dev/null

# Wait a moment
sleep 1

# Start fresh
cd /root/.openclaw/workspace
node server.js
