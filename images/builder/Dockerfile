FROM node:22-slim AS builder

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

COPY --chown=node:node --chmod=755 ./frontend-build.sh /app/frontend-build.sh

