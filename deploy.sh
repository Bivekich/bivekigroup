#!/bin/bash

# Остановка и удаление старых контейнеров
docker-compose down

# Удаление старых образов
docker system prune -f

# Сборка и запуск новых контейнеров
docker-compose up -d --build
