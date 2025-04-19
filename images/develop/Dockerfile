# Use a lightweight base image
FROM ghcr.io/yuki-js/dotfiles/dotimage:latest

# Set environment variables
ENV PATH="/home/user/.asdf/bin:/home/user/.asdf/shims:$PATH"
ENV user_ENV=development

# Switch to root user for setup
USER root
RUN echo "user ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/user

# Create application directory
RUN mkdir /app && chown -R user:user /app

# Switch to non-root user
USER user
WORKDIR /app

# Clone only necessary parts of the repository
RUN git clone --depth 1 --filter=blob:none --sparse https://github.com/AokiApp/plasmic-selfhost.git plasmic \
    && cd plasmic \
    && git sparse-checkout set platform packages

WORKDIR /app/plasmic
RUN git submodule update --init --recursive --depth 1
RUN rm /app/plasmic/.tool-versions
RUN npm i -g yarn
RUN yarn

# Build specific components
WORKDIR /app/plasmic/platform/wab
RUN yarn install \
    && yarn run build-css \
    && make

WORKDIR /app/plasmic/platform
RUN <<EOF
  for i in "./canvas-packages/" "./live-frame/" "./loader-html-hydrate/" "./react-web-bundle/" "./sub/"; do
    cd $i
    yarn install
    yarn run build || exit 1
    cd ..
  done
EOF

# Clean up unnecessary files to reduce image size
RUN rm -rf /app/plasmic/platform/**/node_modules/.cache ~/.cache ~/.npm ~/.yarn ~/.yarnrc.yml ~/.yarnrc.yml.lock

# Final user setup
USER user
