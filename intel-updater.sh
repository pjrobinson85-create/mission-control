#!/bin/bash
# Intel Updater — Cron wrapper for intel-fetcher.js
# Runs: 7am, 10am, 1pm, 4pm, 7pm (Brisbane time)

cd /root/.openclaw/workspace

# Check if server is running
if ! curl -s http://localhost:8899/mc/status > /dev/null 2>&1; then
    echo "[$(date)] Server not running, starting..."
    node server.cjs > /tmp/server.log 2>&1 &
    sleep 2
fi

# Run intel fetcher
node intel-fetcher.js >> /tmp/intel-updater.log 2>&1

echo "[$(date)] Intel update complete"
