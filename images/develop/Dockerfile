FROM ghcr.io/yuki-js/dotfiles/dotimage:latest
USER root
RUN apt update -y && apt install postgresql libseccomp-dev rsync iproute2 screen -y --no-install-recommends \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

RUN usermod -aG postgres user


RUN mkdir -p /verdaccio/storage && \
    chown -R user:user /verdaccio

RUN echo "user ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/user

USER user

WORKDIR /home/user/codes

RUN git clone https://github.com/plasmicapp/plasmic.git plasmic --depth 1

WORKDIR /home/user/codes/plasmic

ENV PATH="/home/user/.asdf/bin:/home/user/.asdf/shims:$PATH"

RUN <<EOF
  cd /home/user/codes/plasmic
  . "$HOME/.asdf/asdf.sh"
  asdf install
  npm install -g yarn verdaccio
  yarn global add pm2
EOF

RUN <<EOF
  yarn config set registry http://localhost:4873/
  verdaccio --config /home/user/codes/plasmic/verdaccio-config.yaml &
  sleep 5
  
  yarn install
EOF

WORKDIR /home/user/codes/plasmic/platform/wab
RUN yarn install
RUN yarn run build-css
RUN make

WORKDIR /home/user/codes/plasmic/platform
RUN <<EOF
  for i in "./canvas-packages/" "./host-test/" "./integration-tests/" "./live-frame/" "./loader-bundle-env/" "./loader-html-hydrate/" "./loader-tests/" "./react-renderer/" "./react-web-bundle/" "./sub/"; do
    cd $i
    yarn install
    yarn run build
    cd ..
  done
EOF