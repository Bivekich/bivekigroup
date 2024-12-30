FROM node:18-alpine AS builder

# Добавляем переменные окружения
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7568759273:AAHoUoR9GDxpXr6x6LiOinQqXgbQ09zwsNY
ENV NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1002470042907
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=5eulp3wj
ENV POSTGRES_USER=biveki
ENV POSTGRES_PASSWORD=0DlsKfd__Q
ENV POSTGRES_HOST=85.234.110.60
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=bivekigroup
ENV JWT_SECRET=B9F4Yks-TZ
ENV SMTP_HOST=smtp.timeweb.ru
ENV SMTP_PORT=465
ENV SMTP_USER=developer@biveki.ru
ENV SMTP_PASS=37mrqwtr36
ENV NEXT_PUBLIC_APP_URL=https://biveki.ru

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY next.config.ts ./

RUN npm run build

# Продакшн образ
FROM node:18-alpine AS runner
WORKDIR /app

# Копируем переменные окружения в продакшн образ
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7568759273:AAHoUoR9GDxpXr6x6LiOinQqXgbQ09zwsNY
ENV NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1002470042907
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=5eulp3wj
ENV POSTGRES_USER=biveki
ENV POSTGRES_PASSWORD=0DlsKfd__Q
ENV POSTGRES_HOST=85.234.110.60
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=bivekigroup
ENV JWT_SECRET=B9F4Yks-TZ
ENV SMTP_HOST=smtp.timeweb.ru
ENV SMTP_PORT=465
ENV SMTP_USER=developer@biveki.ru
ENV SMTP_PASS=37mrqwtr36
ENV NEXT_PUBLIC_APP_URL=https://biveki.ru

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
