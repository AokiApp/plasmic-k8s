FROM node:22-slim

RUN apt update -y && \
    apt install ca-certificates bubblewrap -y --no-install-recommends && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* 
RUN mkdir /plat && chown -R node:node /plat
WORKDIR /plat

ENV NODE_ENV=production

COPY --from=ghcr.io/aokiapp/plasmic-k8s/builder:latest --chown=node:node /app/plasmic/platform/ /plat/

USER node
RUN bash -eux <<'EOF'
  for i in ./*; do
    cd $i
    yarn install --production=false --ignore-scripts --prefer-offline
    cd ..
  done
EOF

WORKDIR /plat/wab

CMD ["bash", "tools/run.bash", "src/wab/server/codegen-backend.ts"]

