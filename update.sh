#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Обновление проекта USSR.Space ===${NC}"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker не установлен. Пожалуйста, установите Docker и попробуйте снова.${NC}"
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose не установлен. Пожалуйста, установите Docker Compose и попробуйте снова.${NC}"
    exit 1
fi

# Проверка наличия Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git не установлен. Пожалуйста, установите Git и попробуйте снова.${NC}"
    exit 1
fi

# Обновление репозитория
echo -e "${YELLOW}Получение последних изменений из репозитория...${NC}"
git pull

# Остановка контейнеров
echo -e "${YELLOW}Остановка контейнеров...${NC}"
docker-compose down

# Сборка новых образов
echo -e "${YELLOW}Сборка новых образов...${NC}"
docker-compose build

# Запуск контейнеров
echo -e "${YELLOW}Запуск обновленных контейнеров...${NC}"
docker-compose up -d

# Применение миграций
echo -e "${YELLOW}Применение миграций к базе данных...${NC}"
docker-compose exec backend alembic upgrade head

echo -e "${GREEN}=== Проект USSR.Space успешно обновлен ===${NC}"
echo -e "${GREEN}Фронтенд доступен по адресу: ${YELLOW}http://localhost:3000${NC}"
echo -e "${GREEN}API доступно по адресу: ${YELLOW}http://localhost:8000/api/v1${NC}"
echo -e "${GREEN}Документация API: ${YELLOW}http://localhost:8000/docs${NC}"

# Вывод логов
echo -e "${GREEN}Вывод логов (Ctrl+C для выхода):${NC}"
docker-compose logs -f 