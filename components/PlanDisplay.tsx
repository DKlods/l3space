import React, { useState } from 'react';
import { FullPlan, FitnessPlan, DietPlan, Exercise, Recipe, GoalType } from '../types';
import Chat from './Chat';
import MarketplaceView from './MarketplaceView';
import PremiumUpsell from './PremiumUpsell';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { useRouter } from '../contexts/RouterContext';
import { GOAL_NAMES } from '../lib/constants';

interface PlanDisplayProps {
  plan: FullPlan;
  onReset: () => void;
}

type View = 'fitness' | 'diet' | 'market';

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onReset }) => {
  const [view, setView] = useState<View>('fitness');
  const { currentUser } = useAuth();

  const { fitnessPlan, dietPlan, requiredEquipment, shoppingList } = plan;

  const groupedExercises = fitnessPlan.exercises.reduce((acc, exercise) => {
    const day = exercise.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);
  
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  const sortedDays = daysOfWeek.filter(day => groupedExercises[day]);


  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark-primary dark:text-text-light-primary">{fitnessPlan.name}</h2>
            <p className="text-text-dark-secondary dark:text-text-light-secondary">Цель: {GOAL_NAMES[fitnessPlan.goal]} | Уровень: {fitnessPlan.level}</p>
        </div>
        <button
            onClick={onReset}
            className="bg-soviet-red text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300 flex-shrink-0"
        >
            Изменить цель
        </button>
      </div>

      <div className="flex border-b border-light-tertiary dark:border-dark-tertiary mb-6 overflow-x-auto">
        <button
          onClick={() => setView('fitness')}
          className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 shrink-0 ${view === 'fitness' ? 'border-b-2 border-soviet-red text-text-dark-primary dark:text-text-light-primary' : 'text-text-dark-secondary dark:text-text-light-secondary'}`}
        >
          Тренировки
        </button>
        <button
          onClick={() => setView('diet')}
          className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 shrink-0 ${view === 'diet' ? 'border-b-2 border-soviet-red text-text-dark-primary dark:text-text-light-primary' : 'text-text-dark-secondary dark:text-text-light-secondary'}`}
        >
          Питание
        </button>
        <button
          onClick={() => setView('market')}
          className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 shrink-0 ${view === 'market' ? 'border-b-2 border-soviet-red text-text-dark-primary dark:text-text-light-primary' : 'text-text-dark-secondary dark:text-text-light-secondary'}`}
        >
          Покупки
        </button>
      </div>

      {view === 'fitness' && (
        <FitnessPlanView plan={fitnessPlan} sortedDays={sortedDays} groupedExercises={groupedExercises}/>
      )}
      {view === 'diet' && (
        <DietPlanView plan={dietPlan} />
      )}
      {view === 'market' && (
          <MarketplaceView equipment={requiredEquipment} shoppingList={shoppingList} />
      )}

      {currentUser?.role === 'premium' ? <Chat plan={plan} /> : <PremiumUpsell />}
    </div>
  );
};

const FitnessPlanView: React.FC<{plan: FitnessPlan, sortedDays: string[], groupedExercises: Record<string, Exercise[]>}> = ({plan, sortedDays, groupedExercises}) => {
    const { startWorkout } = useWorkout();
    const { navigate } = useRouter();

    const handleStartWorkout = (day: string) => {
        const exercises = groupedExercises[day];
        if (exercises) {
            startWorkout(exercises, day);
            navigate('/workout-session');
        }
    };

    if(plan.exercises.length === 0){
        return (
            <div className="text-center py-10">
                <p className="text-xl text-text-dark-secondary dark:text-text-light-secondary">План тренировок не предусмотрен для цели "{GOAL_NAMES[plan.goal]}".</p>
                <p className="mt-2 text-text-dark-secondary dark:text-text-light-secondary">Сфокусируйтесь на плане питания.</p>
            </div>
        )
    }
    return (
        <div className="space-y-6">
            {sortedDays.map(day => (
                <div key={day} className="bg-light-primary dark:bg-dark-tertiary p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-soviet-red">{day}</h3>
                        <button 
                            onClick={() => handleStartWorkout(day)}
                            className="bg-soviet-red text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
                        >
                            Начать тренировку
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedExercises[day].map((exercise, index) => (
                            <div key={index} className="bg-light-secondary dark:bg-dark-primary p-4 rounded">
                                <h4 className="font-bold text-text-dark-primary dark:text-text-light-primary">{exercise.name}</h4>
                                <p className="text-text-dark-secondary dark:text-text-light-secondary"><span className="font-semibold">{exercise.sets}</span> подходов по <span className="font-semibold">{exercise.reps}</span> повторений</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{exercise.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
};

const DietPlanView: React.FC<{plan: DietPlan}> = ({plan}) => (
    <div>
        <div className="text-center mb-6 bg-light-primary dark:bg-dark-tertiary p-3 rounded-lg">
            <h3 className="text-xl font-bold text-text-dark-primary dark:text-text-light-primary">Дневная норма калорий: <span className="text-soviet-red">{plan.caloriesPerDay} ккал</span></h3>
        </div>
        <div className="space-y-4">
            {plan.recipes.map((recipe) => (
                <div key={recipe.id} className="bg-light-primary dark:bg-dark-tertiary p-4 rounded-lg">
                    <h4 className="text-lg font-bold text-soviet-red">{recipe.mealType}: <span className="text-text-dark-primary dark:text-text-light-primary">{recipe.title}</span></h4>
                    <div className="flex justify-between items-center text-sm text-text-dark-secondary dark:text-text-light-secondary mt-1 mb-2">
                        <span>Калории: {recipe.calories} ккал</span>
                        <span>Б: {recipe.macros.protein}г / Ж: {recipe.macros.fat}г / У: {recipe.macros.carbs}г</span>
                    </div>
                    <div>
                        <p className="font-semibold text-text-dark-secondary dark:text-text-light-secondary">Ингредиенты:</p>
                        <ul className="list-disc list-inside text-gray-500 dark:text-gray-400">
                            {recipe.ingredients.map((ing, i) => <li key={i}>{ing.name} ({ing.amount})</li>)}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export default PlanDisplay;
