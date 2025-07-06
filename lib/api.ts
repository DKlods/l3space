import axios from 'axios';
import { User, Progress, WorkoutHistory, FullPlan } from '../types';

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена аутентификации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ussr-space-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерфейсы для запросов
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  name: string;
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
  current_goal?: 'gain_mass' | 'get_ripped' | 'maintain' | 'diet_only';
  settings?: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
}

interface ProgressRequest {
  weight: number;
}

interface WorkoutHistoryRequest {
  workout_name: string;
  duration_minutes: number;
}

// API-клиент
export const authAPI = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.post<User>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },
};

export const userAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  
  updateUser: async (userData: UserUpdateRequest): Promise<User> => {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
  },
  
  upgradeToPremium: async (): Promise<User> => {
    const response = await api.post<User>('/users/me/premium');
    return response.data;
  },
};

export const progressAPI = {
  getUserProgress: async (): Promise<Progress[]> => {
    const response = await api.get<Progress[]>('/users/me/progress');
    return response.data;
  },
  
  addProgress: async (weight: number): Promise<Progress> => {
    const response = await api.post<Progress>('/users/me/progress', { weight });
    return response.data;
  },
};

export const workoutAPI = {
  getWorkoutHistory: async (): Promise<WorkoutHistory[]> => {
    const response = await api.get<WorkoutHistory[]>('/users/me/workout-history');
    return response.data;
  },
  
  addWorkoutHistory: async (workoutName: string, durationMinutes: number): Promise<WorkoutHistory> => {
    const response = await api.post<WorkoutHistory>('/users/me/workout-history', {
      workout_name: workoutName,
      duration_minutes: durationMinutes,
    });
    return response.data;
  },
};

export const challengeAPI = {
  toggleChallenge: async (challengeId: string): Promise<User> => {
    const response = await api.post<User>(`/users/me/challenge/${challengeId}`);
    return response.data;
  },
};

export const planAPI = {
  generatePlan: async (planData: FullPlan): Promise<FullPlan> => {
    const response = await api.post<FullPlan>('/plans/generate', planData);
    return response.data;
  },
  
  getCurrentPlan: async (): Promise<FullPlan> => {
    const response = await api.get<FullPlan>('/plans/current');
    return response.data;
  },
}; 