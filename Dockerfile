FROM node:20-alpine AS builder

# Добавляем переменные окружения
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7568759273:AAHoUoR9GDxpXr6x6LiOinQqXgbQ09zwsNY \
    NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1002470042907 \
    NEXT_PUBLIC_SANITY_PROJECT_ID=5eulp3wj \
    POSTGRES_USER=biveki \
    POSTGRES_PASSWORD=0DlsKfd__Q \
    POSTGRES_HOST=85.234.110.60 \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=bivekigroup \
    JWT_SECRET=B9F4Yks-TZ \
    SMTP_HOST=smtp.timeweb.ru \
    SMTP_PORT=465 \
    SMTP_USER=developer@biveki.ru \
    SMTP_PASS=37mrqwtr36 \
    NEXT_PUBLIC_APP_URL=https://biveki.ru \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Продакшн образ
FROM node:18-alpine AS runner
WORKDIR /app

# Копируем переменные окружения в продакшн образ
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7568759273:AAHoUoR9GDxpXr6x6LiOinQqXgbQ09zwsNY \
    NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1002470042907 \
    NEXT_PUBLIC_SANITY_PROJECT_ID=5eulp3wj \
    POSTGRES_USER=biveki \
    POSTGRES_PASSWORD=0DlsKfd__Q \
    POSTGRES_HOST=85.234.110.60 \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=bivekigroup \
    JWT_SECRET=B9F4Yks-TZ \
    SMTP_HOST=smtp.timeweb.ru \
    SMTP_PORT=465 \
    SMTP_USER=developer@biveki.ru \
    SMTP_PASS=37mrqwtr36 \
    NEXT_PUBLIC_APP_URL=https://biveki.ru \
    NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
