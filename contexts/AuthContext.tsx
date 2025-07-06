import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User, Progress, GoalType, Challenge, WorkoutHistory } from '../types';
import { MOCK_CHALLENGES } from '../lib/constants';
import { authAPI, userAPI } from '../lib/api';

const createNewUser = (email: string, name: string, password?: string): User => ({
  id: `user-${new Date().getTime()}`,
  email,
  name,
  password, // For simulation only
  role: 'user',
  isProfileComplete: false,
  gender: null,
  age: null,
  height: null,
  currentGoal: null,
  settings: {
    theme: 'dark',
    notifications: true,
  },
  progress: [],
  dailyChallenges: MOCK_CHALLENGES.map(c => ({...c, completed: false})),
  workoutHistory: [],
});

interface AuthContextType {
  currentUser: User | null;
  isInitialized: boolean;
  register: (name:string, email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  setUserGoal: (goal: GoalType | null) => void;
  addProgress: (newProgress: Omit<Progress, 'date'>) => void;
  toggleChallenge: (challengeId: string) => void;
  addWorkoutToHistory: (workout: Omit<WorkoutHistory, 'id' | 'date'>) => void;
  toggleTheme: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setInitialized] = useState(false);
  
  const loadUsersFromStorage = (): Map<string, User> => {
      try {
        const usersJson = window.localStorage.getItem('ussr-space-users');
        return usersJson ? new Map(JSON.parse(usersJson)) : new Map();
      } catch (error) {
          return new Map();
      }
  };

  const saveUsersToStorage = (users: Map<string, User>) => {
      window.localStorage.setItem('ussr-space-users', JSON.stringify(Array.from(users.entries())));
  };

  const updateUserInStorage = useCallback((user: User) => {
    const users = loadUsersFromStorage();
    users.set(user.email, user);
    saveUsersToStorage(users);
  }, []);

  useEffect(() => {
    try {
      const token = window.localStorage.getItem('ussr-space-token');
      if (token) {
        // В будущем здесь будет запрос к API для получения данных пользователя
        // userAPI.getCurrentUser().then(setCurrentUser);
        
        // Временное решение для локального хранения данных
        const currentUserId = window.localStorage.getItem('ussr-space-currentUser-id');
        if (currentUserId) {
          const users = loadUsersFromStorage();
          const user = users.get(currentUserId);
          if(user) {
              setCurrentUser(user);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load current user", error);
    } finally {
        setInitialized(true);
    }
  }, []);


  const register = async (name:string, email: string, password: string): Promise<User> => {
      try {
        // В будущем здесь будет запрос к API для регистрации
        // const response = await authAPI.register(name, email, password);
        // window.localStorage.setItem('ussr-space-token', response.access_token);
        // const user = await userAPI.getCurrentUser();
        
        // Временное решение для локального хранения данных
        const users = loadUsersFromStorage();
        if(users.has(email)) {
            throw new Error('Пользователь с таким email уже существует.');
        }
        const newUser = createNewUser(email, name, password);
        users.set(email, newUser);
        saveUsersToStorage(users);
        setCurrentUser(newUser);
        window.localStorage.setItem('ussr-space-currentUser-id', newUser.email);
        window.localStorage.setItem('ussr-space-token', 'mock-token');
        return newUser;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
  };

  const login = async (email: string, password: string): Promise<User> => {
      try {
        // В будущем здесь будет запрос к API для входа
        // const response = await authAPI.login(email, password);
        // window.localStorage.setItem('ussr-space-token', response.access_token);
        // const user = await userAPI.getCurrentUser();
        
        // Временное решение для локального хранения данных
        const users = loadUsersFromStorage();
        const user = users.get(email);
        if(!user || user.password !== password) {
            throw new Error('Неверный email или пароль.');
        }
        setCurrentUser(user);
        window.localStorage.setItem('ussr-space-currentUser-id', user.email);
        window.localStorage.setItem('ussr-space-token', 'mock-token');
        return user;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
  };

  const logout = () => {
      setCurrentUser(null);
      window.localStorage.removeItem('ussr-space-currentUser-id');
      window.localStorage.removeItem('ussr-space-token');
  };
  
  const updateUser = (updatedData: Partial<User>) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updatedData };
      updateUserInStorage(updatedUser);
      return updatedUser;
    });
  };

  const setUserGoal = (goal: GoalType | null) => {
    updateUser({ currentGoal: goal });
  };

  const addProgress = (newProgress: Omit<Progress, 'date'>) => {
    if (!currentUser) return;
    const today = new Date().toISOString();
    const updatedProgress = [...currentUser.progress, { date: today, ...newProgress }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    updateUser({ progress: updatedProgress });
  };

  const toggleChallenge = (challengeId: string) => {
    if (!currentUser) return;
    const updatedChallenges = currentUser.dailyChallenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, completed: !challenge.completed }
        : challenge
    );
    updateUser({ dailyChallenges: updatedChallenges });
  };

  const addWorkoutToHistory = (workout: Omit<WorkoutHistory, 'id' | 'date'>) => {
    if (!currentUser) return;
    const newHistoryEntry: WorkoutHistory = {
        id: `wh-${new Date().getTime()}`,
        date: new Date().toISOString(),
        ...workout,
    };
    const updatedHistory = [...currentUser.workoutHistory, newHistoryEntry];
    updateUser({ workoutHistory: updatedHistory });
  };

  const toggleTheme = () => {
    if (!currentUser) return;
    const newTheme = currentUser.settings.theme === 'dark' ? 'light' : 'dark';
    updateUser({ settings: { ...currentUser.settings, theme: newTheme } });
  };

  const upgradeToPremium = () => {
      if (!currentUser) return;
      updateUser({ role: 'premium' });
  };

  return (
    <AuthContext.Provider value={{ 
        currentUser,
        isInitialized, 
        register,
        login,
        logout,
        updateUser,
        setUserGoal, 
        addProgress, 
        toggleChallenge, 
        addWorkoutToHistory,
        toggleTheme,
        upgradeToPremium,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
