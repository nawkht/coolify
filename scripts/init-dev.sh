mkdir -p /data/coolify/haproxy /data/coolify/letsencrypt

if [ ! -f /app/defaults/haproxy/coolify.lock ]; then
    cp -Rp /app/defaults/haproxy/ /data/coolify/
    touch /app/defaults/haproxy/coolify.lock
fi


yarn global add pnpm && pnpm config set store-dir /root/.pnpm-store && pnpm install && pnpm dev:migrate && pnpm dev