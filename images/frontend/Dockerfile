FROM lighttpd:1.4-alpine

# ボリュームマウントされる静的ファイルのディレクトリ
VOLUME /app/build

# lighttpdの設定ファイルをコピー
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf

# デフォルトの作業ディレクトリを設定
WORKDIR /app/build

# lighttpdを起動
CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]