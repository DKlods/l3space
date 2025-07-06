
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProgressChart from './ProgressChart';

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);


const ProgressTracker: React.FC = () => {
    const { currentUser: user, addProgress } = useAuth();
    const [newWeight, setNewWeight] = useState('');

    if (!user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weightValue = parseFloat(newWeight);
        if (!isNaN(weightValue) && weightValue > 0) {
            addProgress({ weight: weightValue });
            setNewWeight('');
        }
    };

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-text-dark-primary dark:text-text-light-primary mb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-3 text-soviet-red"/>
                Динамика Веса
            </h2>
            <div className="h-40 mb-4">
                <ProgressChart data={user.progress} />
            </div>

            <h3 className="text-lg font-bold text-text-dark-primary dark:text-text-light-primary mb-2">
                Добавить запись
            </h3>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Вес, кг"
                    className="w-full bg-light-tertiary dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded p-2 text-sm text-text-dark-primary dark:text-text-light-primary focus:outline-none focus:ring-1 focus:ring-soviet-red"
                    aria-label="New weight in kg"
                />
                <button
                    type="submit"
                    className="bg-soviet-red text-white font-bold px-4 rounded hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                    disabled={!newWeight}
                    aria-label="Log new weight"
                >
                    +
                </button>
            </form>
            
            {user.progress.length > 0 && (
                 <div className="mt-4">
                    <h3 className="text-lg font-bold text-text-dark-primary dark:text-text-light-primary mb-2">
                        История
                    </h3>
                    <ul className="text-sm space-y-1 max-h-24 overflow-y-auto pr-2">
                        {user.progress.slice().reverse().map((p, index) => (
                            <li key={index} className="flex justify-between text-text-dark-secondary dark:text-text-light-secondary p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                                <span>{new Date(p.date).toLocaleDateString('ru-RU')}:</span>
                                <span className="font-semibold text-text-dark-primary dark:text-text-light-primary">{p.weight} кг</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;