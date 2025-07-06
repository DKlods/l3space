
export type GoalType = 'gain_mass' | 'get_ripped' | 'maintain' | 'diet_only';
export type ChallengeType = 'water' | 'steps' | 'workout' | 'sleep';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  goal: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface WorkoutHistory {
    id: string;
    date: string;
    workoutName: string;
    durationMinutes: number;
}

export interface User {
  id:string;
  email: string;
  password?: string; // For simulation, would be hash in real DB
  name: string;
  role: 'user' | 'premium' | 'admin';
  isProfileComplete: boolean;
  gender: 'male' | 'female' | 'other' | null;
  age: number | null;
  height: number | null;
  currentGoal: GoalType | null;
  settings: UserSettings;
  progress: Progress[];
  dailyChallenges: Challenge[];
  workoutHistory: WorkoutHistory[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
}

export interface Progress {
  date: string; // Using string for simplicity, can be Date object
  weight: number;
}

export interface Goal {
  type: GoalType;
  name: string;
  description: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  mealType: 'Завтрак' | 'Перекус 1' | 'Обед' | 'Перекус 2' | 'Ужин';
  title: string;
  ingredients: Ingredient[];
  macros: { protein: number; fat: number; carbs: number; };
  calories: number;
}

export interface DietPlan {
  id: string;
  type: 'balanced' | 'vegan' | 'keto' | 'no_personalization';
  personalized: boolean;
  caloriesPerDay: number;
  recipes: Recipe[];
}

export interface Exercise {
  day: 'Понедельник' | 'Вторник' | 'Среда' | 'Четверг' | 'Пятница' | 'Суббота' | 'Воскресенье';
  name: string;
  sets: number;
  reps: string;
  description: string;
}

export interface FitnessPlan {
  id: string;
  name: string;
  goal: GoalType;
  level: 'beginner' | 'advanced';
  exercises: Exercise[];
  durationWeeks: number;
}

export interface MarketplaceItem {
  name: string;
  amount?: string; // Optional, for shopping list
}

export interface FullPlan {
    fitnessPlan: FitnessPlan;
    dietPlan: DietPlan;
    requiredEquipment: MarketplaceItem[];
    shoppingList: MarketplaceItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}