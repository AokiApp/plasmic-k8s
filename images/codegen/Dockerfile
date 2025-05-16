FROM node:22-slim

RUN apt update -y && \
    apt install ca-certificates bubblewrap -y --no-install-recommends && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* 
RUN mkdir /plat && chown -R node:node /plat
WORKDIR /plat

ENV NODE_ENV=production

COPY --from=ghcr.io/aokiapp/plasmic-k8s/builder:latest --chown=node:node /app/plasmic/platform/ /plat/

RUN bash -eux <<'EOF'
  for i in "./canvas-packages/" "./live-frame/" "./loader-html-hydrate/" "./react-web-bundle/" "./sub/"; do
    cd $i
    yarn install --production=false
    yarn run build
    cd ..
  done
EOF

WORKDIR /plat/wab

USER node
CMD ["bash", "tools/run.bash", "src/wab/server/codegen-backend.ts"]

