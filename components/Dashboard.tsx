import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoalType, FullPlan, User } from '../types';
import { generatePlan } from '../services/geminiService';

import Profile from './Profile';
import GoalSelector from './GoalSelector';
import PlanDisplay from './PlanDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Intro from './Intro';
import Challenges from './Challenges';
import ActivityHistory from './ActivityHistory';
import UserStats from './UserStats';
import Recommendations from './Recommendations';
import ProgressChart from './ProgressChart';

const Dashboard: React.FC = () => {
  const { currentUser, setUserGoal } = useAuth();
  const [plan, setPlan] = useState<FullPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectGoal = useCallback(async (goal: GoalType) => {
    if (!currentUser) return;
    
    setUserGoal(goal);
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const generatedPlan = await generatePlan(currentUser as User, goal);
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка при генерации плана.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setUserGoal]);
  
  const handleReset = () => {
    setPlan(null);
    setError(null);
    setIsLoading(false);
    setUserGoal(null); // Reset goal in context
  };
  
  // This effect handles auto-generation if a goal is set but no plan exists
  useEffect(() => {
    if (currentUser?.currentGoal && !plan && !isLoading && !error) {
      handleSelectGoal(currentUser.currentGoal);
    }
  }, [currentUser?.currentGoal, plan, isLoading, error, handleSelectGoal]);

  if (!currentUser) {
    return <LoadingSpinner />; // Or some other placeholder
  }

  return (
    <div className="space-y-8">
      <Profile />
      
      <UserStats />
      
      {currentUser.isProfileComplete && <Recommendations />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            {currentUser.dailyChallenges && currentUser.dailyChallenges.length > 0 && <Challenges />}
            {currentUser.progress && currentUser.progress.length > 0 && (
              <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-4 shadow-sm h-80">
                <ProgressChart />
              </div>
            )}
        </div>
        <div className="lg:col-span-1 space-y-6">
            <ActivityHistory />
        </div>
      </div>


      {isLoading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error} onReset={handleReset} />}

      {!isLoading && !error && !currentUser.currentGoal && (
        <div className="animate-fade-in">
          <Intro />
          <GoalSelector onSelectGoal={handleSelectGoal} />
        </div>
      )}
      
      {!isLoading && !error && plan && <PlanDisplay plan={plan} onReset={handleReset} />}
    </div>
  );
};

export default Dashboard;