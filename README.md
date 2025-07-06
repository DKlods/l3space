# USSR.Space - Платформа для здоровья, фитнеса и питания с AI-поддержкой

USSR.Space — это современная AI-поддерживаемая экосистема для управления здоровьем, фитнесом и питанием, реализованная в виде web-решения. Платформа объединяет персонализированные планы, геймификацию, AI-коучинг и интеграции с e-commerce в едином, интуитивно понятном интерфейсе.

## Структура проекта

- `components` - React компоненты
- `pages` - Страницы приложения
- `contexts` - React контексты (включая AuthContext)
- `lib` - Вспомогательные функции и API клиент
- `services` - Сервисы для работы с AI и другими функциями
- `backend` - FastAPI/Python API
- `docs` - Документация проекта

## Запуск проекта

### Предварительные требования

- Node.js 18+ (для фронтенда)
- Python 3.9+ (для бэкенда)
- Docker и Docker Compose (для контейнеризации)
- Google Gemini API ключ

### Быстрый запуск

Для удобства запуска проекта используйте скрипт `start.sh`:

```bash
# Сделать скрипт исполняемым
chmod +x start.sh

# Запустить проект
./start.sh
```

Скрипт автоматически:
1. Проверит наличие необходимых инструментов (Docker, Docker Compose)
2. Создаст файл `.env` с настройками по умолчанию, если он не существует
3. Запустит контейнеры Docker
4. Применит миграции к базе данных
5. Выведет информацию о доступе к сервисам

### Запуск с использованием Docker вручную

1. Создайте файл `.env` со следующим содержимым:

```
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
```

2. Убедитесь, что в файле `.env` указан действительный ключ API для Google Gemini:
```
GEMINI_API_KEY=your_actual_gemini_api_key
```

3. Запустите проект с помощью Docker Compose:

```bash
docker-compose up -d
```

4. Примените миграции к базе данных:

```bash
docker-compose exec backend alembic upgrade head
```

### Настройка переменных окружения

Для корректной работы с Google Gemini API необходимо настроить следующие переменные окружения:

- `GEMINI_API_KEY` - ключ API для Google Gemini (используется в бэкенде)
- `VITE_GEMINI_API_KEY` - тот же ключ API, но для использования во фронтенде

В файле `docker-compose.yml` эти переменные передаются в соответствующие контейнеры:

```yaml
frontend:
  environment:
    - API_URL=http://backend:8000/api/v1
    - GEMINI_API_KEY=${GEMINI_API_KEY}
    - VITE_GEMINI_API_KEY=${GEMINI_API_KEY}

backend:
  environment:
    - GEMINI_API_KEY=${GEMINI_API_KEY}
```

### Доступ к сервисам

- **Фронтенд**: http://localhost:3000
- **API**: http://localhost:8000/api/v1
- **Документация API (Swagger)**: http://localhost:8000/docs

### Запуск без Docker

#### Фронтенд

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

#### Бэкенд

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ussr_space
export SECRET_KEY=your_super_secret_key
export GEMINI_API_KEY=your_gemini_api_key

# Запуск сервера
uvicorn app.main:app --reload
```

## Зависимости

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Google Gemini API
- Chart.js и react-chartjs-2 для визуализации данных
- React Router для навигации
- Axios для HTTP-запросов
- JWT для аутентификации

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT для аутентификации
- Alembic для миграций
- Google Gemini API

## Документация

Подробная документация проекта находится в директории `docs`:

- [Статус реализации](docs/IMPLEMENTATION_STATUS.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [Дорожная карта](docs/ROADMAP.md)
