# Dt. Gözde Hilal Morkoyunlu Diş Kliniği — Docker imajı (Dokploy uyumlu)
FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/data

# Bağımlılıklar (önbellek katmanı)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Uygulama
COPY server ./server
COPY public ./public

# SQLite veritabanı burada tutulur -> Dokploy'da bu klasöre kalıcı volume bağlayın
RUN mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["bun", "server/index.ts"]

