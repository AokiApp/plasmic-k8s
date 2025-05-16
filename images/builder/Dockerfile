FROM node:22-slim AS builder

ENV NODE_ENV=production

USER root

# Install dependencies, clone repository, and build using a single heredoc
RUN bash -eux <<'EOF'
  apt update -y
  apt install git ca-certificates make -y --no-install-recommends
  apt clean
  rm -rf /var/lib/apt/lists/*

  mkdir -p /app && chown -R node:node /app
EOF

USER node
WORKDIR /app

RUN bash -eux <<'EOF'
  cd /app
  git clone --depth 1 --filter=blob:none --sparse https://github.com/AokiApp/plasmic-selfhost.git plasmic
  cd /app/plasmic
  git sparse-checkout set platform packages

  cd /app/plasmic/platform/wab
  yarn install --production=false
  yarn run build-css
  make

  cd /app/plasmic/platform
  for i in "./canvas-packages/" "./live-frame/" "./loader-html-hydrate/" "./react-web-bundle/" "./sub/"; do
    cd $i
    yarn install --production=false
    yarn run build
    cd ..
  done

  rm -rf /app/plasmic/platform/**/node_modules/.cache ~/.cache ~/.npm ~/.yarn ~/.yarnrc.yml ~/.yarnrc.yml.lock /tmp/* /usr/local/share/.cache/yarn
EOF


ENTRYPOINT ["bash"]