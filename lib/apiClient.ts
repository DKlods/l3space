import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User, Progress, WorkoutHistory, FullPlan, GoalType } from '../types';

// Определяем базовый URL для API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Интерфейсы для запросов и ответов
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserUpdateRequest {
  name?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  height?: number;
  current_goal?: GoalType;
  settings?: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
}

// Класс API-клиента
class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем интерцептор для добавления токена к запросам
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Загружаем токен из localStorage при инициализации
    this.token = localStorage.getItem('ussr-space-token');
  }

  // Метод для установки токена
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('ussr-space-token', token);
  }

  // Метод для удаления токена
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('ussr-space-token');
  }

  // Методы для работы с аутентификацией
  async login(email: string, password: string): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await this.api.post<TokenResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      this.setToken(response.data.access_token);
      return this.getCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await this.api.post<User>('/auth/register', {
        name,
        email,
        password,
      });

      // После регистрации выполняем вход
      return this.login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Методы для работы с пользователем
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async updateUser(userData: UserUpdateRequest): Promise<User> {
    try {
      const response = await this.api.put<User>('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async upgradeToPremium(): Promise<User> {
    try {
      const response = await this.api.post<User>('/users/me/premium');
      return response.data;
    } catch (error) {
      console.error('Upgrade to premium error:', error);
      throw error;
    }
  }

  // Методы для работы с прогрессом
  async getUserProgress(): Promise<Progress[]> {
    try {
      const response = await this.api.get<Progress[]>('/users/me/progress');
      return response.data;
    } catch (error) {
      console.error('Get progress error:', error);
      throw error;
    }
  }

  async addProgress(weight: number): Promise<Progress> {
    try {
      const response = await this.api.post<Progress>('/users/me/progress', { weight });
      return response.data;
    } catch (error) {
      console.error('Add progress error:', error);
      throw error;
    }
  }

  // Методы для работы с историей тренировок
  async getWorkoutHistory(): Promise<WorkoutHistory[]> {
    try {
      const response = await this.api.get<WorkoutHistory[]>('/users/me/workout-history');
      return response.data;
    } catch (error) {
      console.error('Get workout history error:', error);
      throw error;
    }
  }

  async addWorkoutHistory(workoutName: string, durationMinutes: number): Promise<WorkoutHistory> {
    try {
      const response = await this.api.post<WorkoutHistory>('/users/me/workout-history', {
        workout_name: workoutName,
        duration_minutes: durationMinutes,
      });
      return response.data;
    } catch (error) {
      console.error('Add workout history error:', error);
      throw error;
    }
  }

  // Методы для работы с челленджами
  async toggleChallenge(challengeId: string): Promise<User> {
    try {
      const response = await this.api.post<User>(`/users/me/challenge/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error('Toggle challenge error:', error);
      throw error;
    }
  }

  // Методы для работы с планами
  async generatePlan(goal: GoalType): Promise<FullPlan> {
    try {
      const response = await this.api.post<FullPlan>('/ai/generate-plan', { goal });
      return response.data;
    } catch (error) {
      console.error('Generate plan error:', error);
      throw error;
    }
  }

  async getCurrentPlan(): Promise<FullPlan> {
    try {
      const response = await this.api.get<FullPlan>('/plans/current');
      return response.data;
    } catch (error) {
      console.error('Get current plan error:', error);
      throw error;
    }
  }

  // Метод для получения конфигурации чата (только для премиум-пользователей)
  async getChatConfig(): Promise<any> {
    try {
      const response = await this.api.post('/ai/chat-config');
      return response.data;
    } catch (error) {
      console.error('Get chat config error:', error);
      throw error;
    }
  }
}

// Создаем и экспортируем экземпляр API-клиента
export const apiClient = new ApiClient(); 