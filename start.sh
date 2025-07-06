#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Запуск проекта USSR.Space ===${NC}"

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

# Проверка наличия .env файлов
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Файл .env не найден. Создаю из шаблона...${NC}"
    cat > .env << EOL
# Общие настройки
NODE_ENV=development

# Настройки базы данных
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ussr_space
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Настройки бэкенда
BACKEND_PORT=8000
SECRET_KEY=your_super_secret_key_change_this_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your_gemini_api_key

# Настройки фронтенда
VITE_API_BASE_URL=http://localhost:8000/api/v1
EOL
    echo -e "${GREEN}Файл .env создан. Пожалуйста, отредактируйте его, чтобы установить правильные значения.${NC}"
fi

# Запуск Docker Compose
echo -e "${GREEN}Запуск контейнеров Docker...${NC}"
docker-compose up -d

# Проверка статуса контейнеров
echo -e "${GREEN}Проверка статуса контейнеров...${NC}"
sleep 5
docker-compose ps

# Применение миграций к базе данных
echo -e "${GREEN}Применение миграций к базе данных...${NC}"
docker-compose exec backend alembic upgrade head

echo -e "${GREEN}=== Проект USSR.Space запущен ===${NC}"
echo -e "${GREEN}Фронтенд доступен по адресу: ${YELLOW}http://localhost:3000${NC}"
echo -e "${GREEN}API доступно по адресу: ${YELLOW}http://localhost:8000/api/v1${NC}"
echo -e "${GREEN}Документация API: ${YELLOW}http://localhost:8000/docs${NC}"

# Вывод логов
echo -e "${GREEN}Вывод логов (Ctrl+C для выхода):${NC}"
docker-compose logs -f 