import json
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.models.user import User

class GeminiClient:
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
    MODEL = "gemini-2.5-flash-preview-04-17"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("Gemini API key is not provided")
        
        self.client = httpx.AsyncClient(
            timeout=60.0,  # Увеличенный таймаут для генерации планов
        )
    
    async def generate_content(self, prompt: str, temperature: float = 0.5, response_mime_type: str = "application/json") -> Dict[str, Any]:
        """
        Генерирует контент с помощью Gemini API
        """
        url = f"{self.BASE_URL}/models/{self.MODEL}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": response_mime_type,
            }
        }
        
        response = await self.client.post(url, json=payload)
        response.raise_for_status()
        
        return response.json()
    
    async def create_chat(self, system_instruction: str, temperature: float = 0.8) -> Dict[str, Any]:
        """
        Создает новый чат с системной инструкцией
        """
        # В текущей версии API нет прямого метода для создания чата,
        # поэтому возвращаем данные для инициализации чата на клиенте
        return {
            "model": self.MODEL,
            "systemInstruction": system_instruction,
            "temperature": temperature,
        }


async def get_plan_prompt(user: User, goal: str) -> str:
    """
    Формирует промпт для генерации плана тренировок и питания
    """
    last_weight = None
    if user.progress:
        # Предполагаем, что progress отсортирован по дате
        last_weight = user.progress[-1].weight
    
    user_profile = f"""
- Цель: "{goal}"
- Пол: {user.gender or "не указан"}
- Возраст: {user.age or "не указан"}
- Рост: {user.height or "не указан"} см
- Текущий вес: {last_weight or "не указан"} кг
"""

    prompt = f"""
Ты — элитный AI-тренер и диетолог мирового класса для платформы USSR.Space. Твоя задача — создать комплексный, персонализированный и научно обоснованный план на 1 неделю, основываясь на данных пользователя.
Твой ответ должен быть ИСКЛЮЧИТЕЛЬНО в формате одного валидного JSON-объекта, без какого-либо окружающего текста, пояснений или markdown-разметки (никаких \`\`\`json).
Язык всего генерируемого контента (названия, описания и т.д.) должен быть РУССКИМ.

Вот данные пользователя:
{user_profile}

JSON-объект должен строго соответствовать следующей структуре:
{{
  "fitnessPlan": {{
    "id": "string", // сгенерируй UUID
    "name": "string", // например, "Недельный план для набора массы"
    "goal": "{goal}",
    "level": "beginner",
    "exercises": [ // Массив упражнений на неделю. 3-4 тренировочных дня. Учитывай данные пользователя.
      {{
        "day": "Понедельник" | "Среда" | "Пятница" | "Суббота",
        "name": "string", "sets": "number", "reps": "string", "description": "string"
      }}
    ],
    "durationWeeks": 1
  }},
  "dietPlan": {{
    "id": "string", // сгенерируй UUID
    "type": "balanced",
    "personalized": true,
    "caloriesPerDay": "number", // Рассчитай точное значение калорий для цели и данных пользователя (например, по формуле Харриса-Бенедикта).
    "recipes": [ // Список рецептов на ОДИН день (3 основных, 2 перекуса).
      {{
        "id": "string", // сгенерируй UUID
        "mealType": "Завтрак" | "Перекус 1" | "Обед" | "Перекус 2" | "Ужин",
        "title": "string",
        "ingredients": [ {{ "name": "string", "amount": "string" }} ],
        "macros": {{ "protein": "number", "fat": "number", "carbs": "number" }},
        "calories": "number"
      }}
    ]
  }},
  "requiredEquipment": [ // Список инвентаря для тренировок.
    {{ "name": "string" }} // например, "Гантели", "Коврик для йоги"
  ],
  "shoppingList": [ // Агрегированный список продуктов для диеты на НЕДЕЛЮ. Суммируй все ингредиенты из рецептов и умножь на 7.
    {{ "name": "string", "amount": "string" }} // например, "Куриная грудка", "700 г"
  ]
}}

Важные замечания:
- Если цель — 'diet_only', объект fitnessPlan всё равно должен быть возвращен, но с пустым массивом exercises, а requiredEquipment должен быть пустым.
- Если для тренировок не нужен инвентарь, requiredEquipment должен быть пустым массивом.
- Всегда предоставляй полный план питания и список покупок.
"""
    return prompt


async def generate_plan(user: User, goal: str) -> Dict[str, Any]:
    """
    Генерирует план тренировок и питания с помощью Gemini API
    """
    if not user.is_profile_complete:
        raise ValueError("User profile is not complete. Cannot generate a personalized plan.")
    
    gemini_client = GeminiClient()
    prompt = await get_plan_prompt(user, goal)
    
    response = await gemini_client.generate_content(
        prompt=prompt,
        temperature=0.5,
        response_mime_type="application/json"
    )
    
    # Извлекаем JSON из ответа
    candidates = response.get("candidates", [])
    if not candidates:
        raise ValueError("No response from Gemini API")
    
    content = candidates[0].get("content", {})
    parts = content.get("parts", [])
    if not parts:
        raise ValueError("Empty response from Gemini API")
    
    json_text = parts[0].get("text", "")
    
    # Удаляем возможные маркеры кода
    json_text = json_text.replace("```json", "").replace("```", "").strip()
    
    try:
        plan_data = json.loads(json_text)
        
        # Валидация структуры ответа
        if not all(key in plan_data for key in ["fitnessPlan", "dietPlan", "requiredEquipment", "shoppingList"]):
            raise ValueError("Invalid JSON structure received from API")
        
        return plan_data
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON response: {str(e)}")


async def get_chat_system_instruction(plan_data: Dict[str, Any]) -> str:
    """
    Формирует системную инструкцию для чата с AI-коучем
    """
    return f"""Ты — экспертный ИИ-тренер и диетолог для платформы USSR.Space. Пользователь только что получил следующий план тренировок и питания. Твоя роль — быть мотивационным тренером, отвечать на вопросы пользователя о плане и давать полезные советы. Все твои ответы должны быть на РУССКОМ языке.
Вот план пользователя для контекста:
{json.dumps(plan_data, ensure_ascii=False, indent=2)}""" 