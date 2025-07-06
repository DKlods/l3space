import React from 'react';
import { GoalType } from '../types';
import { GOALS, GOAL_ICONS } from '../lib/constants';

interface GoalSelectorProps {
  onSelectGoal: (goal: GoalType) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ onSelectGoal }) => {
  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-text-dark-primary dark:text-text-light-primary">Выберите вашу цель:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {GOALS.map((goal) => (
          <div
            key={goal.type}
            onClick={() => onSelectGoal(goal.type)}
            className="bg-light-primary dark:bg-dark-tertiary rounded-lg p-6 text-center cursor-pointer border-2 border-light-tertiary dark:border-dark-tertiary hover:border-soviet-red transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
          >
            <div className="flex justify-center items-center">
                {GOAL_ICONS[goal.type]}
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-dark-primary dark:text-text-light-primary">{goal.name}</h3>
            <p className="text-text-dark-secondary dark:text-text-light-secondary">{goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalSelector;
