FROM node:18-alpine AS builder

# Копируем .env файл
COPY .env .env

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY next.config.ts ./

RUN npm run build

# Продакшн образ
FROM node:18-alpine AS runner
WORKDIR /app

# Копируем .env файл в продакшн образ
COPY --from=builder .env .env

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
