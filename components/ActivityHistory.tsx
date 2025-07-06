
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
    </svg>
);


const ActivityHistory: React.FC = () => {
    const { currentUser } = useAuth();
    
    if (!currentUser) return null;

    const history = currentUser.workoutHistory || [];

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6 h-full">
            <h2 className="text-xl font-bold text-text-dark-primary dark:text-text-light-primary mb-4 flex items-center">
                <HistoryIcon className="w-6 h-6 mr-3 text-soviet-red"/>
                Журнал Активности
            </h2>
            {history.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {history.slice().reverse().map(item => (
                        <li key={item.id} className="bg-light-primary dark:bg-dark-tertiary p-3 rounded-md flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-text-dark-primary dark:text-text-light-primary">{item.workoutName}</p>
                                <p className="text-text-dark-secondary dark:text-text-light-secondary">{new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</p>
                            </div>
                            <span className="text-text-dark-secondary dark:text-text-light-secondary">{item.durationMinutes} мин</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-text-dark-secondary dark:text-text-light-secondary py-10">
                    <p>Вы еще не завершили ни одной тренировки. Начните сегодня!</p>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory;
