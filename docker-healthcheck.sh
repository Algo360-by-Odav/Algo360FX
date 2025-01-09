#!/bin/bash
set -eo pipefail

# Check if nginx is running
if ! pgrep -x nginx > /dev/null; then
    echo "Nginx is not running"
    exit 1
fi

# Check if we can connect to nginx
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Health check failed"
    exit 1
fi

echo "Health check passed"
exit 0
