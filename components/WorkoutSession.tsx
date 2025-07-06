import React, { useState, useEffect, useCallback } from 'react';
import { useWorkout } from '../contexts/WorkoutContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

const RestTimer: React.FC<{ duration: number; onComplete: () => void, onSkip: () => void }> = ({ duration, onComplete, onSkip }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, onComplete]);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-center p-4 bg-blue-900/50 rounded-lg">
            <p className="text-lg text-text-light-secondary">Отдых</p>
            <p className="text-6xl font-bold text-white my-2">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
            <button onClick={onSkip} className="bg-white/20 text-white px-4 py-1 rounded-full text-sm hover:bg-white/30 transition">Пропустить</button>
        </div>
    );
};

const WorkoutSession: React.FC = () => {
    const { workout, workoutName, endWorkout, isSessionActive } = useWorkout();
    const { addWorkoutToHistory } = useAuth();
    const { navigate } = useRouter();

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});
    const [isResting, setResting] = useState(false);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        if (!isSessionActive) {
            navigate('/dashboard');
        }
    }, [isSessionActive, navigate]);

    // This effect reliably checks for exercise completion after state updates.
    useEffect(() => {
        if (!workout || !workout[currentExerciseIndex]) return;

        const currentSets = completedSets[currentExerciseIndex] || [];
        const allSetsForCurrentExerciseCompleted = currentSets.filter(Boolean).length === workout[currentExerciseIndex].sets;

        if (allSetsForCurrentExerciseCompleted) {
             if (currentExerciseIndex < workout.length - 1) {
                setResting(true);
            }
        }

    }, [completedSets, currentExerciseIndex, workout]);
    
    const handleSetToggle = (exerciseIndex: number, setIndex: number) => {
        setCompletedSets(prev => {
            const newSets = { ...prev };
            const exerciseSets = [...(newSets[exerciseIndex] || [])];
            exerciseSets[setIndex] = !exerciseSets[setIndex];
            newSets[exerciseIndex] = exerciseSets;
            return newSets;
        });
    };
    
    const handleNextExercise = useCallback(() => {
        setResting(false);
        if (workout && currentExerciseIndex < workout.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        }
    }, [currentExerciseIndex, workout]);

    const handleFinishWorkout = () => {
        const durationMinutes = Math.round((Date.now() - startTime) / 60000);
        addWorkoutToHistory({ workoutName: workoutName || "Тренировка", durationMinutes });
        endWorkout();
    };

    // Robust guard clause to prevent crashes on render or refresh.
    if (!isSessionActive || !workout || !workout[currentExerciseIndex]) {
        return <div className="min-h-screen bg-dark-primary flex items-center justify-center text-white">Загрузка сессии...</div>;
    }

    const currentExercise = workout[currentExerciseIndex];

    return (
        <div className="min-h-screen bg-dark-primary text-white flex flex-col p-4 md:p-8 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-soviet-red">{workoutName}</h1>
                <button onClick={handleFinishWorkout} className="bg-soviet-red text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition-colors">
                    Завершить
                </button>
            </header>

            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-2xl bg-dark-secondary rounded-lg p-6 shadow-2xl">
                    <div className="text-center mb-6">
                         <p className="text-text-light-secondary">Упражнение {currentExerciseIndex + 1} из {workout.length}</p>
                         <h2 className="text-3xl md:text-5xl font-bold my-2">{currentExercise.name}</h2>
                         <p className="text-lg text-text-light-secondary">{currentExercise.sets} подходов по {currentExercise.reps} повторений</p>
                    </div>

                    {isResting ? (
                        <RestTimer duration={60} onComplete={handleNextExercise} onSkip={handleNextExercise}/>
                    ) : (
                        <div className="space-y-3">
                            {[...Array(currentExercise.sets)].map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleSetToggle(currentExerciseIndex, i)}
                                    className={`
                                        flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2
                                        ${completedSets[currentExerciseIndex]?.[i]
                                            ? 'bg-green-900/50 border-green-500'
                                            : 'bg-dark-tertiary border-transparent hover:border-soviet-red'
                                        }
                                    `}
                                >
                                    <span className="font-bold text-lg">Подход {i + 1}</span>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${completedSets[currentExerciseIndex]?.[i] ? 'bg-green-500 border-green-400' : 'border-gray-600'}`}>
                                        {completedSets[currentExerciseIndex]?.[i] && (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-6 flex justify-center">
                {currentExerciseIndex === workout.length - 1 && !isResting ? (
                    <button onClick={handleFinishWorkout} className="bg-green-600 text-white font-bold py-3 px-12 rounded-lg text-lg hover:bg-green-700 transition-colors">
                        Завершить тренировку
                    </button>
                ) : (
                    <button disabled={isResting} onClick={handleNextExercise} className="bg-soviet-red text-white font-bold py-3 px-12 rounded-lg text-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Следующее
                    </button>
                )}
            </footer>
        </div>
    );
};

export default WorkoutSession;