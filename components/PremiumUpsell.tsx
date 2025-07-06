
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PremiumUpsell: React.FC = () => {
    const { upgradeToPremium } = useAuth();

    return (
        <div className="mt-8 pt-6 border-t border-light-tertiary dark:border-dark-tertiary animate-fade-in text-center bg-gradient-to-tr from-yellow-300/20 via-soviet-red/20 to-dark-tertiary/20 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-text-dark-primary dark:text-text-light-primary mb-2">
                Разблокируйте AI-тренера
            </h3>
            <p className="text-text-dark-secondary dark:text-text-light-secondary mb-4 max-w-xl mx-auto">
                Получите безлимитный доступ к чату с нашим интеллектуальным тренером. Задавайте вопросы, просите замены упражнений и получайте персональные советы в реальном времени.
            </p>
            <button
                onClick={upgradeToPremium}
                className="bg-soviet-red text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Улучшить до Premium
            </button>
        </div>
    );
};

export default PremiumUpsell;