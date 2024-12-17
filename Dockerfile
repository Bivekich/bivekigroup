# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Создаем production сборку
RUN npm run build

# Этап production
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем только production зависимости
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Копируем необходимые файлы из этапа сборки
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Указываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
