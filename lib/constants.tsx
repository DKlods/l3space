import React from 'react';
import { Goal, GoalType, Challenge, ChallengeType } from '../types';

const DumbbellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.4 14.4 9.6 9.6" />
        <path d="M18.657 5.343a2 2 0 1 0-2.829-2.829l-1.414 1.414" />
        <path d="m11.343 12.657-1.414 1.414" />
        <path d="M6.757 17.243a2 2 0 1 0-2.829-2.829l1.414-1.414" />
        <path d="m12.657 11.343 1.414-1.414" />
        <path d="M5.343 5.343a2 2 0 1 0 2.829 2.829l1.414-1.414" />
        <path d="m9.6 14.4-1.414 1.414" />
        <path d="M17.243 18.657a2 2 0 1 0 2.829-2.829l-1.414-1.414" />
        <path d="m14.4 9.6 1.414-1.414" />
    </svg>
);

const RippedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5C8.134 5 5 8.134 5 12s3.134 7 7 7 7-3.134 7-7" />
        <path d="M12 19c-3.866 0-7-3.134-7-7" />
        <path d="M12 5c3.866 0 7 3.134 7 7s-3.134 7-7 7" />
    </svg>
);

const BalanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 12h20" />
        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.866 8.165 6.839 9.488" />
        <path d="M12 2a10 10 0 0 1 10 10c0 4.42-2.866 8.165-6.839 9.488" />
    </svg>
);

const DietIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 19.118a8.998 8.998 0 0 0 2.94-11.416 8.999 8.999 0 0 0-14.88 7.398" />
        <path d="M5 22a2 2 0 0 0 2 0l4-2-4-4-2 2a2 2 0 0 0 0 2Z" />
        <path d="M16 11.37A6.01 6.01 0 0 1 12 17a6.002 6.002 0 0 1-5-2.63" />
    </svg>
);

export const GOALS: Goal[] = [
  { type: 'gain_mass', name: 'Набор массы', description: 'Максимизация мышечного роста и силы' },
  { type: 'get_ripped', name: 'Рельеф и сушка', description: 'Снижение жировой прослойки и прорисовка мышц' },
  { type: 'maintain', name: 'Поддержание формы', description: 'Сохранение текущих результатов и тонуса' },
  { type: 'diet_only', name: 'Только питание', description: 'Фокус на рационе без плана тренировок' },
];

export const GOAL_ICONS: Record<GoalType, React.ReactNode> = {
    gain_mass: <DumbbellIcon className="w-12 h-12 mb-4 text-soviet-red" />,
    get_ripped: <RippedIcon className="w-12 h-12 mb-4 text-soviet-red" />,
    maintain: <BalanceIcon className="w-12 h-12 mb-4 text-soviet-red" />,
    diet_only: <DietIcon className="w-12 h-12 mb-4 text-soviet-red" />
};

export const GOAL_NAMES: Record<GoalType, string> = {
  gain_mass: 'Набор массы',
  get_ripped: 'Рельеф и сушка',
  maintain: 'Поддержание формы',
  diet_only: 'Только питание',
};

export const GENDER_NAMES: Record<string, string> = {
    male: 'Мужчина',
    female: 'Женщина',
    other: 'Другой'
};

const WaterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 14.03a.75.75 0 0 0-1.06 0l-3-3a.75.75 0 1 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06l-7 7Z" clipRule="evenodd" />
    </svg>
);

const StepsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.25 4.533A9.721 9.721 0 0 0 12 4.5c1.956 0 3.745.57 5.25 1.547v-.547a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h.547A8.221 8.221 0 0 0 12 6c-1.63 0-3.132.484-4.375 1.322L6.1 6.1A.75.75 0 0 1 7.16 5.04l1.532 1.531a.75.75 0 0 1-1.06 1.06L6.098 6.1C4.795 7.152 4.02 8.683 3.75 10.5H2.25a.75.75 0 0 1 0-1.5h1.5a8.23 8.23 0 0 1 2.002-4.42L4.22 3.047a.75.75 0 0 1 1.06-1.06l1.532 1.531a.75.75 0 1 1-1.06 1.06L4.22 3.047A9.707 9.707 0 0 1 7.533 1.5H9a.75.75 0 0 1 0 1.5H7.533A8.22 8.22 0 0 0 6 3.503l1.598 1.598c1.243-.837 2.745-1.321 4.377-1.321ZM20.953 16.78a.75.75 0 1 1-1.06 1.06l-1.532-1.531a.75.75 0 0 1 1.06-1.06l1.532 1.531Zm-2.6-4.03a.75.75 0 0 1-1.06 0l-1.532-1.531a.75.75 0 0 1 1.06-1.06l1.532 1.531a.75.75 0 0 1 0 1.06ZM12 18.001a8.21 8.21 0 0 1-5.125-1.73L5.28 17.865a.75.75 0 0 1-1.06-1.06l1.598-1.598A8.23 8.23 0 0 1 4.5 12H6a.75.75 0 0 1 0-1.5H4.5a9.73 9.73 0 0 0 1.547 5.25H5.5a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v.547A8.221 8.221 0 0 1 6 12c0-1.63.484-3.132 1.322-4.375L6.1 6.1A.75.75 0 0 1 7.16 5.04l1.532 1.531a.75.75 0 0 1-1.06 1.06L6.098 6.1A9.71 9.71 0 0 0 3 12c0 2.22.753 4.281 2.047 5.902l-1.532 1.531a.75.75 0 1 1-1.06-1.06l1.531-1.532A9.682 9.682 0 0 1 1.5 16.5v-1.967a.75.75 0 0 1 1.5 0v1.967a8.22 8.22 0 0 1 1.003-2.625l-1.532-1.531a.75.75 0 0 1 1.06-1.06l1.532 1.531c1.243.838 2.744 1.322 4.375 1.322 1.956 0 3.745-.57 5.25-1.547v.547a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h.547A8.221 8.221 0 0 1 12 18c-1.63 0-3.132-.484-4.375-1.322l-1.223 1.223a.75.75 0 0 0 1.06 1.06l1.223-1.223A6.721 6.721 0 0 0 12 19.5a6.72 6.72 0 0 0 4.275-1.558l1.223 1.223a.75.75 0 0 0 1.06-1.06l-1.223-1.223A6.702 6.702 0 0 0 19.5 12c0-.597-.08-1.173-.228-1.725l1.598-1.598a.75.75 0 1 0-1.06-1.06l-1.598 1.598C17.348 9.984 16.098 9 14.625 9c-.597 0-1.173.08-1.725.228l-1.598-1.598a.75.75 0 1 0-1.06 1.06l1.598 1.598C10.026 9.652 9 10.902 9 12.375c0 .597.08 1.173.228 1.725l-1.598 1.598a.75.75 0 1 0 1.06 1.06l1.598-1.598c.552 1.497 1.802 2.625 3.375 2.895v1.467a.75.75 0 0 0 1.5 0V18Z" />
    </svg>
);

const WorkoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 7.232l9 4.5 9-4.5-8.622-5.63ZM21.75 7.96l-9 4.5v9l9-4.5v-9Zm-10.5 0v9l-9-4.5v-9l9 4.5Z" />
    </svg>
);

const SleepIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.54 2.124a9.75 9.75 0 0 0-9.664 9.664c0 5.385 4.365 9.75 9.75 9.75 3.515 0 6.565-1.855 8.25-4.572a.75.75 0 0 1-1.12-1.002 7.72 7.72 0 0 0-7.13-4.176Z" clipRule="evenodd" />
    </svg>
);


export const CHALLENGE_ICONS: Record<ChallengeType, React.ReactNode> = {
    water: <WaterIcon className="w-8 h-8" />,
    steps: <StepsIcon className="w-8 h-8" />,
    workout: <WorkoutIcon className="w-8 h-8" />,
    sleep: <SleepIcon className="w-8 h-8" />
};

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'ch1', type: 'water', title: 'Выпить 2л воды', goal: 2, current: 0, unit: 'л', completed: false },
  { id: 'ch2', type: 'steps', title: 'Пройти 8,000 шагов', goal: 8000, current: 0, unit: 'шагов', completed: false },
  { id: 'ch3', type: 'workout', title: 'Выполнить тренировку', goal: 1, current: 0, unit: 'раз', completed: false },
  { id: 'ch4', type: 'sleep', title: 'Спать 7 часов', goal: 7, current: 0, unit: 'часов', completed: false },
];
