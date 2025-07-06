import React from 'react';

const Intro: React.FC = () => {
    return (
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-dark-primary dark:text-text-light-primary">Добро пожаловать в экосистему здоровья</h2>
            <p className="text-lg text-text-dark-secondary dark:text-text-light-secondary max-w-3xl mx-auto">
                Выберите вашу главную цель, и наш искусственный интеллект создаст для вас персонализированный план тренировок и питания, чтобы вы могли достичь желаемых результатов максимально эффективно.
            </p>
        </div>
    );
};

export default Intro;