
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Exercise } from '../types';

interface WorkoutContextType {
  workout: Exercise[] | null;
  workoutName: string | null;
  isSessionActive: boolean;
  startWorkout: (exercises: Exercise[], name: string) => void;
  endWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<Exercise[] | null>(null);
  const [workoutName, setWorkoutName] = useState<string | null>(null);
  const [isSessionActive, setSessionActive] = useState(false);

  const startWorkout = useCallback((exercises: Exercise[], name: string) => {
    setWorkout(exercises);
    setWorkoutName(name);
    setSessionActive(true);
  }, []);

  const endWorkout = useCallback(() => {
    setWorkout(null);
    setWorkoutName(null);
    setSessionActive(false);
  }, []);

  return (
    <WorkoutContext.Provider value={{ workout, workoutName, isSessionActive, startWorkout, endWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
