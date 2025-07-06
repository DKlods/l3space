#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BACKUP_DIR="./backups"
TEMP_DIR="${BACKUP_DIR}/temp"

echo -e "${YELLOW}=== Восстановление проекта USSR.Space из резервной копии ===${NC}"

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

# Проверка наличия директории с резервными копиями
if [ ! -d "${BACKUP_DIR}" ]; then
    echo -e "${RED}Директория с резервными копиями не найдена: ${BACKUP_DIR}${NC}"
    exit 1
fi

# Получение списка доступных резервных копий
BACKUPS=($(ls -1 ${BACKUP_DIR}/ussr_space_backup_*.tar.gz 2>/dev/null))

# Проверка наличия резервных копий
if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}Резервные копии не найдены в директории: ${BACKUP_DIR}${NC}"
    exit 1
fi

# Вывод списка доступных резервных копий
echo -e "${GREEN}Доступные резервные копии:${NC}"
for i in "${!BACKUPS[@]}"; do
    BACKUP_DATE=$(echo "${BACKUPS[$i]}" | grep -oP 'ussr_space_backup_\K\d{8}_\d{6}')
    FORMATTED_DATE=$(date -d "${BACKUP_DATE:0:8} ${BACKUP_DATE:9:2}:${BACKUP_DATE:11:2}:${BACKUP_DATE:13:2}" "+%d.%m.%Y %H:%M:%S" 2>/dev/null)
    if [ $? -ne 0 ]; then
        FORMATTED_DATE="${BACKUP_DATE:0:8} ${BACKUP_DATE:9:2}:${BACKUP_DATE:11:2}:${BACKUP_DATE:13:2}"
    fi
    echo -e "[$i] ${FORMATTED_DATE} - ${BACKUPS[$i]}"
done

# Запрос выбора резервной копии
read -p "Выберите номер резервной копии для восстановления: " BACKUP_INDEX

# Проверка корректности ввода
if ! [[ "$BACKUP_INDEX" =~ ^[0-9]+$ ]] || [ "$BACKUP_INDEX" -ge ${#BACKUPS[@]} ]; then
    echo -e "${RED}Некорректный выбор. Пожалуйста, введите число от 0 до $((${#BACKUPS[@]}-1))${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$BACKUP_INDEX]}"
echo -e "${GREEN}Выбрана резервная копия: ${SELECTED_BACKUP}${NC}"

# Создание временной директории для распаковки архива
mkdir -p "${TEMP_DIR}"

# Распаковка архива
echo -e "${YELLOW}Распаковка архива...${NC}"
tar -xzf "${SELECTED_BACKUP}" -C "${TEMP_DIR}"

# Проверка наличия необходимых файлов
DB_BACKUP_FILE=$(find "${TEMP_DIR}" -name "db_backup_*.sql" -type f)
ENV_BACKUP_FILE=$(find "${TEMP_DIR}" -name ".env_backup_*" -type f)

if [ -z "${DB_BACKUP_FILE}" ]; then
    echo -e "${RED}Файл резервной копии базы данных не найден в архиве${NC}"
    rm -rf "${TEMP_DIR}"
    exit 1
fi

# Проверка, запущен ли контейнер с базой данных
if ! docker-compose ps | grep -q "db.*Up"; then
    echo -e "${YELLOW}Контейнер с базой данных не запущен. Запускаем...${NC}"
    docker-compose up -d db
    # Даем время на запуск базы данных
    echo -e "${YELLOW}Ожидаем запуска базы данных...${NC}"
    sleep 10
fi

# Восстановление базы данных
echo -e "${YELLOW}Восстановление базы данных...${NC}"
cat "${DB_BACKUP_FILE}" | docker-compose exec -T db psql -U postgres -d ussr_space

# Проверка успешности восстановления базы данных
if [ $? -eq 0 ]; then
    echo -e "${GREEN}База данных успешно восстановлена${NC}"
else
    echo -e "${RED}Ошибка при восстановлении базы данных${NC}"
    rm -rf "${TEMP_DIR}"
    exit 1
fi

# Восстановление .env файла, если он существует в архиве
if [ -n "${ENV_BACKUP_FILE}" ]; then
    echo -e "${YELLOW}Восстановление .env файла...${NC}"
    cp "${ENV_BACKUP_FILE}" .env
    echo -e "${GREEN}.env файл успешно восстановлен${NC}"
fi

# Удаление временных файлов
rm -rf "${TEMP_DIR}"

# Перезапуск контейнеров
echo -e "${YELLOW}Перезапуск контейнеров...${NC}"
docker-compose down
docker-compose up -d

echo -e "${GREEN}=== Восстановление проекта USSR.Space завершено ===${NC}"
echo -e "${GREEN}Фронтенд доступен по адресу: ${YELLOW}http://localhost:3000${NC}"
echo -e "${GREEN}API доступно по адресу: ${YELLOW}http://localhost:8000/api/v1${NC}"
echo -e "${GREEN}Документация API: ${YELLOW}http://localhost:8000/docs${NC}" 