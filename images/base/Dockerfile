FROM node:22-slim AS builder

# Install dependencies
RUN apt update -y && apt install git curl rsync iproute2 ca-certificates make -y --no-install-recommends \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*


RUN mkdir /app && chown -R node:node /app
WORKDIR /app
RUN git clone https://github.com/plasmicapp/plasmic.git plasmic --depth 1

WORKDIR /app/plasmic/platform/wab
RUN yarn install
RUN yarn run build-css
RUN make

WORKDIR /app/plasmic/platform
RUN <<EOF
  for i in "./canvas-packages/" "./host-test/" "./integration-tests/" "./live-frame/" "./loader-bundle-env/" "./loader-html-hydrate/" "./loader-tests/" "./react-renderer/" "./react-web-bundle/" "./sub/"; do
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

COPY --from=builder --chown=node:node /app/plasmic/platform/wab /app/

CMD ["bash", "tools/run.bash", "src/wab/server/main.ts"]

