# USSR.Space API Backend

Бэкенд для платформы USSR.Space, разработанный на FastAPI с использованием PostgreSQL.

## Установка и запуск

### Предварительные требования

- Python 3.9+
- PostgreSQL
- Redis (опционально)

### Установка зависимостей

```bash
pip install -r requirements.txt
```

### Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта:

```
SECRET_KEY=your_secret_key
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ussr_space_db
GEMINI_API_KEY=your_gemini_api_key
```

### Запуск сервера для разработки

```bash
cd backend
uvicorn app.main:app --reload
```

Сервер будет доступен по адресу: http://localhost:8000

## API Документация

После запуска сервера, документация Swagger UI будет доступна по адресу:

http://localhost:8000/docs

## База данных

### Миграции

Для создания и применения миграций используется Alembic:

```bash
# Создание миграции
alembic revision --autogenerate -m "Initial migration"

# Применение миграций
alembic upgrade head
```

## Тестирование

```bash
pytest
``` 