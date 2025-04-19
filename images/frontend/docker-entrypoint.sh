#!/bin/bash

# Replace environment variables in static files
find /app -type f -exec sed -i \
    -e "s|https://dummy-host-2a1b3c.example.com|$HOST_URL|g" \
    -e "s|https://dummy-public-9d7e6f.example.com|$PUBLIC_URL|g" \
    -e "s|https://dummy-codegen-5e4d3c.example.com|$CODEGEN_HOST|g" \
    -e "s|https://dummy-codegen-origin-8a7b6c.example.com|$CODEGEN_ORIGIN_HOST|g" \
    -e "s|https://dummy-integrations-1a2b3c.example.com|$INTEGRATIONS_HOST|g" \
    -e "s|https://dummy-sentry-dsn-1234567890abcdef@sentry.example.com/1|$SENTRY_DSN|g" \
    {} +

# Verify replacements
echo "Checking environment variable replacements..."
for file in $(find /app -type f); do
    echo "Checking $file:"
    grep -H "dummy-.*\.example\.com" "$file" || echo "No dummy URLs found in $file"
done

# Start lighttpd in foreground mode
lighttpd -D -f /etc/lighttpd/lighttpd.conf