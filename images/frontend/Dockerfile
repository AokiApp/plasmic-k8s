# Stage 1: builder
FROM ghcr.io/aokiapp/plasmic-k8s/builder:latest as builder

# frontend-build.shでビルド（成果物: /app/build）
RUN cd /app/plasmic/platform/wab && \
    NODE_ENV="production" \
    REACT_APP_DEFAULT_HOST_URL="https://dummy-host-2a1b3c.example.com/static/host.html" \
    REACT_APP_PUBLIC_URL="https://dummy-public-9d7e6f.example.com" \
    PUBLIC_URL="https://dummy-public-9d7e6f.example.com" \
    CODEGEN_HOST="https://dummy-codegen-5e4d3c.example.com" \
    CODEGEN_ORIGIN_HOST="https://dummy-codegen-origin-8a7b6c.example.com" \
    INTEGRATIONS_HOST="https://dummy-integrations-1a2b3c.example.com" \
    SENTRY_DSN="https://dummy-sentry-dsn-1234567890abcdef@sentry.example.com/1" \
    yarn rsbuild build

# Stage 2: lighttpd
FROM alpine:latest
RUN apk add --no-cache lighttpd ca-certificates bash

# lighttpdの設定ファイルをコピー
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# builderからbuild成果物をコピー
COPY --from=builder /app/plasmic/platform/wab/build /app/build

WORKDIR /app/build
RUN mkdir -p /var/cache/lighttpd/compress/

CMD ["/docker-entrypoint.sh"]