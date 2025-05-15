FROM node:22-slim

RUN apt update -y && \
    apt install ca-certificates bubblewrap -y --no-install-recommends && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* 
RUN mkdir /app && chown -R node:node /app
WORKDIR /app

ENV NODE_ENV=production

COPY --from=ghcr.io/aokiapp/plasmic-k8s/builder:latest --chown=node:node /app/plasmic/platform/wab /app/
COPY create-system-acct.ts /app/src/wab/server/db/create-system-acct.ts

USER node
CMD ["bash", "tools/run.bash", "src/wab/server/main.ts"]

