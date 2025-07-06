import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProgressTracker from './ProgressTracker';
import { GoalType } from '../types';
import ProfileEditor from './ProfileEditor';
import { GENDER_NAMES, GOAL_NAMES } from '../lib/constants';

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.25 5.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 .75-.75h.75V9a.75.75 0 0 1 .75-.75h.75V7.5a.75.75 0 0 1 .75-.75h.75V5.25Zm3 0h-1.5v.75H9V7.5h-.75V9H9v.75h3.75v-.75H12V7.5h-.75V6.75h-.75V5.25Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.112a.75.75 0 0 1 1.06 0l1.125 1.125a.75.75 0 0 1-1.06 1.06L6.262 7.172a.75.75 0 0 1 0-1.06Zm11.476 0a.75.75 0 0 1 0 1.06l-1.125 1.125a.75.75 0 0 1-1.06-1.06l1.125-1.125a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
);


const GoalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.865 3.32a.75.75 0 0 0-1.03 0L6.75 8.25a.75.75 0 0 0 0 1.06l5.25 5.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06l-5.085-4.93ZM12 11.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M11.192 13.142a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25Z" />
    </svg>
);

const Profile: React.FC = () => {
    const { currentUser: user, logout } = useAuth();
    const [isEditorOpen, setEditorOpen] = useState(false);

    if (!user) return null;
    
    const lastWeight = user.progress.length > 0 ? `${user.progress[user.progress.length - 1].weight} кг` : 'Н/Д';

    return (
        <div className="space-y-6">
            <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <UserIcon className="w-16 h-16 text-soviet-red mr-4 flex-shrink-0"/>
                        <div>
                            <h2 className="text-2xl font-bold text-text-dark-primary dark:text-text-light-primary flex items-center gap-2">
                                {user.name}
                                {user.role === 'premium' && <CrownIcon className="w-6 h-6 text-yellow-400" />}
                            </h2>
                            <p className="text-text-dark-secondary dark:text-text-light-secondary">{user.email || 'email не указан'}</p>
                            <span className={`mt-1 inline-block px-2 py-0.5 rounded text-sm font-semibold capitalize ${user.role === 'premium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-soviet-red/20 text-soviet-red'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setEditorOpen(true)} className="text-sm bg-light-tertiary/80 dark:bg-dark-tertiary/80 px-3 py-1.5 rounded-md hover:bg-light-tertiary dark:hover:bg-dark-tertiary transition-colors">Редактировать</button>
                        <button onClick={logout} className="text-sm bg-soviet-red/20 text-soviet-red px-3 py-1.5 rounded-md hover:bg-soviet-red/30 transition-colors">Выйти</button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-text-dark-secondary dark:text-text-light-secondary">Пол</p>
                        <p className="font-bold text-lg text-text-dark-primary dark:text-text-light-primary">{user.gender ? GENDER_NAMES[user.gender] : 'Н/Д'}</p>
                    </div>
                     <div>
                        <p className="text-sm text-text-dark-secondary dark:text-text-light-secondary">Возраст</p>
                        <p className="font-bold text-lg text-text-dark-primary dark:text-text-light-primary">{user.age ? `${user.age} лет` : 'Н/Д'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-dark-secondary dark:text-text-light-secondary">Рост</p>
                        <p className="font-bold text-lg text-text-dark-primary dark:text-text-light-primary">{user.height ? `${user.height} см` : 'Н/Д'}</p>
                    </div>
                     <div>
                        <p className="text-sm text-text-dark-secondary dark:text-text-light-secondary">Текущий вес</p>
                        <p className="font-bold text-lg text-text-dark-primary dark:text-text-light-primary">{lastWeight}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6 flex items-center">
                    <GoalIcon className="w-16 h-16 text-soviet-red mr-4 flex-shrink-0"/>
                    <div>
                        <h3 className="text-lg text-text-dark-secondary dark:text-text-light-secondary">Текущая цель</h3>
                        <p className="text-2xl font-bold text-text-dark-primary dark:text-text-light-primary">
                            {user.currentGoal ? GOAL_NAMES[user.currentGoal] : 'Не установлена'}
                        </p>
                    </div>
                </div>
                <ProgressTracker />
            </div>

            {isEditorOpen && <ProfileEditor onClose={() => setEditorOpen(false)} />}
        </div>
    );
};

export default Profile;
