#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Остановка проекта USSR.Space ===${NC}"

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

# Остановка контейнеров
echo -e "${YELLOW}Остановка контейнеров...${NC}"
docker-compose down

echo -e "${GREEN}Проект USSR.Space успешно остановлен.${NC}"

# Опционально: очистка неиспользуемых ресурсов
read -p "Очистить неиспользуемые Docker ресурсы? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Очистка неиспользуемых Docker образов...${NC}"
    docker system prune -f
    echo -e "${GREEN}Очистка завершена.${NC}"
fi 