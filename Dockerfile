FROM node:18-alpine AS builder

# Добавляем переменные окружения
ENV NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=7568759273:AAHoUoR9GDxpXr6x6LiOinQqXgbQ09zwsNY
ENV NEXT_PUBLIC_TELEGRAM_CHAT_ID=-1002470042907
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=5eulp3wj

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

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
