FROM node:22-slim

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

ENV NODE_ENV=production

COPY --from=ghcr.io/aokiapp/plasmic-k8s/builder:latest --chown=node:node /app/plasmic/platform/wab /app/

USER node
CMD ["bash", "tools/run.bash", "src/wab/server/main.ts"]

