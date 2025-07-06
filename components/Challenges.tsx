import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CHALLENGE_ICONS } from '../lib/constants';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v1.5H3a.75.75 0 0 0 0 1.5h1.5v1.5H3a.75.75 0 0 0 0 1.5h1.5v1.5H3a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 1.5 0H6v-1.5h1.5a.75.75 0 0 0 1.5 0H6V9h1.5a.75.75 0 0 0 1.5 0H6V7.5h1.5a.75.75 0 0 0 1.5 0H6V6H4.5V4.5h1.5a.75.75 0 0 0 0-1.5H4.5Z" clipRule="evenodd" />
      <path d="M9 2.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5H9.75v1.5h1.5a.75.75 0 0 1 0 1.5H9.75v1.5h1.5a.75.75 0 0 1 0 1.5H9.75v1.5h1.5a.75.75 0 0 1 0 1.5H9.75v3.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V2.25A.75.75 0 0 1 15 1.5a.75.75 0 0 1 .75.75v16.5c0 1.448-1.177 2.625-2.625 2.625h-2.25c-1.448 0-2.625-1.177-2.625-2.625V2.25A.75.75 0 0 1 9 1.5a.75.75 0 0 1 0 1.5Z" />
      <path d="M16.5 2.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5h1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1-1.5 0h1.5v-1.5h-1.5a.75.75 0 0 1-1.5 0h1.5V9h-1.5a.75.75 0 0 1-1.5 0h1.5V7.5h-1.5a.75.75 0 0 1-1.5 0h1.5V6h1.5V4.5h-1.5a.75.75 0 0 1 0-1.5h1.5V2.25a.75.75 0 0 1 1.5 0Z" />
    </svg>
);

const Challenges: React.FC = () => {
    const { currentUser: user, toggleChallenge } = useAuth();

    if (!user || !user.dailyChallenges || user.dailyChallenges.length === 0) {
        return null;
    }

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-4 sm:p-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-text-dark-primary dark:text-text-light-primary mb-4 flex items-center">
                <TrophyIcon className="w-6 h-6 mr-3 text-soviet-red" />
                Сегодняшние испытания
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.dailyChallenges.map(challenge => (
                    <div
                        key={challenge.id}
                        onClick={() => toggleChallenge(challenge.id)}
                        className={`
                            p-4 rounded-lg flex items-center cursor-pointer transition-all duration-300 border-2
                            ${challenge.completed 
                                ? 'bg-green-600/20 dark:bg-green-900/50 border-green-500 dark:border-green-700' 
                                : 'bg-light-tertiary dark:bg-dark-tertiary border-transparent hover:border-soviet-red'
                            }
                        `}
                    >
                        <div className={`
                            mr-4 
                            ${challenge.completed ? 'text-green-500' : 'text-soviet-red'}
                        `}>
                            {CHALLENGE_ICONS[challenge.type]}
                        </div>
                        <div className="flex-grow">
                            <h3 className={`font-semibold text-lg ${challenge.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-text-dark-primary dark:text-text-light-primary'}`}>
                                {challenge.title}
                            </h3>
                        </div>
                         <div className={`
                            w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                            ${challenge.completed 
                                ? 'bg-green-500 border-green-400' 
                                : 'bg-light-primary dark:bg-dark-primary border-gray-300 dark:border-gray-600'
                            }
                        `}>
                            {challenge.completed && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Challenges;
