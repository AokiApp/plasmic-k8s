FROM ghcr.io/aokiapp/plasmic-k8s/base:latest AS builder

# Install dependencies
RUN apt update -y && apt install git curl rsync iproute2 ca-certificates make -y --no-install-recommends \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development

RUN mkdir /app && chown -R node:node /app
WORKDIR /app
RUN git clone https://github.com/plasmicapp/plasmic.git plasmic --depth 1

WORKDIR /app/plasmic
RUN git submodule update --init --recursive
RUN yarn

WORKDIR /app/plasmic/platform/wab
RUN yarn install
RUN yarn run build-css
RUN make

WORKDIR /app/plasmic/platform
RUN <<EOF
  for i in ./*; do
    cd $i
    yarn install
    yarn run build
    cd ..
  done
EOF


FROM node:22-slim

RUN apt update -y && apt install curl -y --no-install-recommends \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/plasmic/platform/wab /app/

# make fake git command binary script to trick plasmic into thinking it's in a git repo
RUN touch /usr/bin/git \
  && echo '#!/bin/bash' > /usr/bin/git \
  && echo 'echo "00000000"' >> /usr/bin/git \
  && chmod +x /usr/bin/git

USER node
CMD ["bash", "tools/run.bash", "src/wab/server/main.ts"]

