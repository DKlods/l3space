import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import { GoalType, FullPlan, User } from "../types";

// Безопасно получаем API ключ
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Отложенная инициализация для предотвращения ошибок при отсутствии API ключа
let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
    if (!API_KEY) {
        // Пользовательская ошибка, которая будет перехвачена UI
        throw new Error("Ключ API от Google Gemini не настроен. Пожалуйста, убедитесь, что переменная окружения VITE_GEMINI_API_KEY установлена.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};


const getPrompt = (user: User, goal: GoalType): string => {
    const lastWeight = user.progress.length > 0 ? user.progress[user.progress.length - 1].weight : null;
    
    const userProfile = `
- Цель: "${goal}"
- Пол: ${user.gender || "не указан"}
- Возраст: ${user.age || "не указан"}
- Рост: ${user.height || "не указан"} см
- Текущий вес: ${lastWeight || "не указан"} кг
`;

return `
Ты — элитный AI-тренер и диетолог мирового класса для платформы USSR.Space. Твоя задача — создать комплексный, персонализированный и научно обоснованный план на 1 неделю, основываясь на данных пользователя.
Твой ответ должен быть ИСКЛЮЧИТЕЛЬНО в формате одного валидного JSON-объекта, без какого-либо окружающего текста, пояснений или markdown-разметки (никаких \`\`\`json).
Язык всего генерируемого контента (названия, описания и т.д.) должен быть РУССКИМ.

Вот данные пользователя:
${userProfile}

JSON-объект должен строго соответствовать следующей структуре:
{
  "fitnessPlan": {
    "id": "string", // сгенерируй UUID
    "name": "string", // например, "Недельный план для набора массы"
    "goal": "${goal}",
    "level": "beginner",
    "exercises": [ // Массив упражнений на неделю. 3-4 тренировочных дня. Учитывай данные пользователя.
      {
        "day": "Понедельник" | "Среда" | "Пятница" | "Суббота",
        "name": "string", "sets": "number", "reps": "string", "description": "string"
      }
    ],
    "durationWeeks": 1
  },
  "dietPlan": {
    "id": "string", // сгенерируй UUID
    "type": "balanced",
    "personalized": true,
    "caloriesPerDay": "number", // Рассчитай точное значение калорий для цели и данных пользователя (например, по формуле Харриса-Бенедикта).
    "recipes": [ // Список рецептов на ОДИН день (3 основных, 2 перекуса).
      {
        "id": "string", // сгенерируй UUID
        "mealType": "Завтрак" | "Перекус 1" | "Обед" | "Перекус 2" | "Ужин",
        "title": "string",
        "ingredients": [ { "name": "string", "amount": "string" } ],
        "macros": { "protein": "number", "fat": "number", "carbs": "number" },
        "calories": "number"
      }
    ]
  },
  "requiredEquipment": [ // Список инвентаря для тренировок.
    { "name": "string" } // например, "Гантели", "Коврик для йоги"
  ],
  "shoppingList": [ // Агрегированный список продуктов для диеты на НЕДЕЛЮ. Суммируй все ингредиенты из рецептов и умножь на 7.
    { "name": "string", "amount": "string" } // например, "Куриная грудка", "700 г"
  ]
}

Важные замечания:
- Если цель — 'diet_only', объект fitnessPlan всё равно должен быть возвращен, но с пустым массивом exercises, а requiredEquipment должен быть пустым.
- Если для тренировок не нужен инвентарь, requiredEquipment должен быть пустым массивом.
- Всегда предоставляй полный план питания и список покупок.
`;
};


export const generatePlan = async (user: User, goal: GoalType): Promise<FullPlan> => {
    try {
        const aiInstance = getAiInstance();
        if (!user.isProfileComplete) {
            throw new Error("User profile is not complete. Cannot generate a personalized plan.");
        }
        const prompt = getPrompt(user, goal);
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.5,
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const parsedData: FullPlan = JSON.parse(jsonStr);
        
        if (!parsedData.fitnessPlan || !parsedData.dietPlan || !parsedData.requiredEquipment || !parsedData.shoppingList) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedData;

    } catch (error) {
        console.error("Error generating plan from Gemini API:", error);
        // Re-throw the error so it can be caught by the UI component
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Произошла неизвестная ошибка при генерации плана.");
    }
};

export const createChat = (plan: FullPlan): GeminiChat => {
    const aiInstance = getAiInstance();
    const systemInstruction = `Ты — экспертный ИИ-тренер и диетолог для платформы USSR.Space. Пользователь только что получил следующий план тренировок и питания. Твоя роль — быть мотивационным тренером, отвечать на вопросы пользователя о плане и давать полезные советы. Все твои ответы должны быть на РУССКОМ языке.
Вот план пользователя для контекста:
${JSON.stringify(plan, null, 2)}`;

    const chat = aiInstance.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
        },
        history: [
             {
                role: 'user',
                parts: [{ text: 'Это мой план. Я готов начать.' }],
            },
            {
                role: 'model',
                parts: [{ text: 'Отлично! Ваш план готов. Я ваш персональный AI-тренер. Задавайте любые вопросы по программе тренировок, диете или списку покупок.' }],
            },
        ]
    });
    return chat;
};