#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Текущая дата и время для имени файла
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
DB_BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql"
ENV_BACKUP_FILE="${BACKUP_DIR}/.env_backup_${TIMESTAMP}"

echo -e "${YELLOW}=== Создание резервной копии проекта USSR.Space ===${NC}"

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

# Создание директории для резервных копий, если она не существует
mkdir -p "${BACKUP_DIR}"

# Проверка, запущен ли контейнер с базой данных
if ! docker-compose ps | grep -q "db.*Up"; then
    echo -e "${YELLOW}Контейнер с базой данных не запущен. Запускаем...${NC}"
    docker-compose up -d db
    # Даем время на запуск базы данных
    echo -e "${YELLOW}Ожидаем запуска базы данных...${NC}"
    sleep 10
fi

# Создание резервной копии базы данных
echo -e "${YELLOW}Создание резервной копии базы данных...${NC}"
docker-compose exec -T db pg_dump -U postgres -d ussr_space > "${DB_BACKUP_FILE}"

# Проверка успешности создания резервной копии БД
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Резервная копия базы данных создана: ${DB_BACKUP_FILE}${NC}"
else
    echo -e "${RED}Ошибка при создании резервной копии базы данных${NC}"
fi

# Создание резервной копии .env файла
if [ -f ".env" ]; then
    echo -e "${YELLOW}Создание резервной копии .env файла...${NC}"
    cp .env "${ENV_BACKUP_FILE}"
    echo -e "${GREEN}Резервная копия .env файла создана: ${ENV_BACKUP_FILE}${NC}"
else
    echo -e "${YELLOW}Файл .env не найден, пропускаем резервное копирование${NC}"
fi

# Архивация резервных копий
echo -e "${YELLOW}Создание архива с резервными копиями...${NC}"
ARCHIVE_FILE="${BACKUP_DIR}/ussr_space_backup_${TIMESTAMP}.tar.gz"
tar -czf "${ARCHIVE_FILE}" -C "${BACKUP_DIR}" "$(basename "${DB_BACKUP_FILE}")" "$(basename "${ENV_BACKUP_FILE}")"

# Проверка успешности создания архива
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Архив с резервными копиями создан: ${ARCHIVE_FILE}${NC}"
    
    # Удаление временных файлов
    rm "${DB_BACKUP_FILE}" "${ENV_BACKUP_FILE}"
    echo -e "${YELLOW}Временные файлы удалены${NC}"
else
    echo -e "${RED}Ошибка при создании архива с резервными копиями${NC}"
fi

echo -e "${GREEN}=== Резервное копирование завершено ===${NC}"
echo -e "${GREEN}Путь к архиву с резервными копиями: ${YELLOW}${ARCHIVE_FILE}${NC}" 