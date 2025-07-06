
import React from 'react';
import { useRouter } from '../contexts/RouterContext';

const Feature: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-dark-secondary p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="flex justify-center items-center mb-4 text-soviet-red">{icon}</div>
    <h3 className="text-xl font-bold text-text-light-primary mb-2">{title}</h3>
    <p className="text-text-light-secondary">{description}</p>
  </div>
);

const DumbbellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M14.4 14.4 9.6 9.6m4.8 0-4.8 4.8M18.657 5.343a2 2 0 1 0-2.829-2.829l-1.414 1.414m2.829 2.829-1.414-1.414m0 0-1.414 1.414m2.829 2.829-1.414-1.414M6.757 17.243a2 2 0 1 0-2.829-2.829l1.414-1.414m2.829 2.829-1.414-1.414m0 0 1.414-1.414m2.829 2.829-1.414-1.414m-1.414-2.829 1.414-1.414" /></svg>);
const DietIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M17 19.118a8.998 8.998 0 0 0 2.94-11.416 8.999 8.999 0 0 0-14.88 7.398m3.88-1.558 4-4 4 4m-4-10.43V4m0 18v-2.07" /></svg>);
const AiIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25l-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-3-3 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 3 3zm9-9-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-1.5-1.5-1.5 1.5-3-3 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75h4.5v4.5h-4.5z" /></svg>);


const LandingPage: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="min-h-screen bg-dark-primary text-text-light-primary font-sans animate-fade-in">
             <header className="py-4 bg-dark-primary/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-soviet-red mr-3">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
                            USSR<span className="text-soviet-red">.</span>Space
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                         <button onClick={() => navigate('/login')} className="text-text-light-secondary hover:text-white transition-colors">
                            Войти
                        </button>
                        <button onClick={() => navigate('/register')} className="bg-soviet-red text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors duration-300">
                            Регистрация
                        </button>
                    </div>
                </div>
            </header>
            
            <main>
                <section className="text-center py-20 md:py-32 px-4">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Ваш <span className="text-soviet-red">AI-тренер</span> для достижения
                        <br />
                        пиковой формы
                    </h2>
                    <p className="text-lg md:text-xl text-text-light-secondary max-w-3xl mx-auto mb-8">
                        Получите персональный план тренировок, диету и поддержку искусственного интеллекта. Начните свой путь к здоровью и силе уже сегодня.
                    </p>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="bg-soviet-red text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
                    >
                        Начать путь к цели
                    </button>
                </section>
                
                <section className="py-20 bg-dark-secondary px-4">
                    <div className="container mx-auto">
                        <h3 className="text-3xl font-bold text-center mb-12">Что вы получите</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Feature 
                                icon={<DumbbellIcon/>}
                                title="Персональные тренировки"
                                description="Программы, созданные AI под вашу цель, уровень подготовки и доступный инвентарь."
                            />
                             <Feature 
                                icon={<DietIcon/>}
                                title="Сбалансированное питание"
                                description="Рацион питания с рецептами и расчетом калорий, адаптированный под ваши нужды."
                            />
                             <Feature 
                                icon={<AiIcon/>}
                                title="Интеллектуальный коучинг"
                                description="Поддержка и мотивация от AI-тренера, который всегда на связи, чтобы помочь вам."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="text-center py-8 text-text-light-secondary/50">
                <p>&copy; {new Date().getFullYear()} USSR.Space. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default LandingPage;