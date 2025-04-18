FROM alpine:latest
# Install lighttpd and ca-certificates
RUN apk add --no-cache lighttpd ca-certificates

# ボリュームマウントされる静的ファイルのディレクトリ
VOLUME /app/build

# lighttpdの設定ファイルをコピー
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf

# デフォルトの作業ディレクトリを設定
WORKDIR /app/build

RUN mkdir -p /var/cache/lighttpd/compress/

# lighttpdを起動
CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]