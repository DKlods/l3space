import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiInfo, FiChevronRight } from 'react-icons/fi';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'workout' | 'health' | 'motivation';
}

const typeColors = {
  nutrition: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  workout: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  health: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  motivation: 'bg-soviet-red bg-opacity-10 text-soviet-red dark:bg-soviet-red dark:bg-opacity-20 dark:text-soviet-red',
};

const typeLabels = {
  nutrition: 'Питание',
  workout: 'Тренировки',
  health: 'Здоровье',
  motivation: 'Мотивация',
};

const getRecommendations = (
  workoutCount: number,
  hasWeightData: boolean,
  weightTrend: 'gain' | 'loss' | 'stable' | 'unknown',
  goal: string | null
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Базовые рекомендации
  recommendations.push({
    id: 'hydration',
    title: 'Пейте больше воды',
    description: 'Старайтесь выпивать не менее 2 литров воды в день для поддержания гидратации и улучшения метаболизма.',
    type: 'health',
  });

  // Рекомендации на основе истории тренировок
  if (workoutCount === 0) {
    recommendations.push({
      id: 'start-workout',
      title: 'Начните с малого',
      description: 'Начните с 2-3 тренировок в неделю по 20-30 минут, постепенно увеличивая нагрузку.',
      type: 'workout',
    });
  } else if (workoutCount < 5) {
    recommendations.push({
      id: 'consistency',
      title: 'Поддерживайте регулярность',
      description: 'Регулярные тренировки даже по 15-20 минут эффективнее, чем редкие интенсивные сессии.',
      type: 'motivation',
    });
  } else {
    recommendations.push({
      id: 'recovery',
      title: 'Не забывайте об отдыхе',
      description: 'Мышцам нужно время для восстановления. Включите в расписание дни активного отдыха.',
      type: 'health',
    });
  }

  // Рекомендации на основе данных о весе
  if (!hasWeightData) {
    recommendations.push({
      id: 'track-weight',
      title: 'Отслеживайте свой вес',
      description: 'Регулярное отслеживание веса поможет вам лучше понимать прогресс и корректировать план.',
      type: 'health',
    });
  } else {
    if (weightTrend === 'gain' && goal === 'get_ripped') {
      recommendations.push({
        id: 'caloric-deficit',
        title: 'Создайте дефицит калорий',
        description: 'Для снижения веса необходимо потреблять меньше калорий, чем вы расходуете. Сократите порции и увеличьте потребление белка.',
        type: 'nutrition',
      });
    } else if (weightTrend === 'loss' && goal === 'gain_mass') {
      recommendations.push({
        id: 'protein-intake',
        title: 'Увеличьте потребление белка',
        description: 'Для набора мышечной массы необходимо потреблять 1.6-2г белка на кг веса тела ежедневно.',
        type: 'nutrition',
      });
    }
  }

  // Рекомендации на основе цели
  if (goal === 'gain_mass') {
    recommendations.push({
      id: 'compound-exercises',
      title: 'Фокусируйтесь на базовых упражнениях',
      description: 'Приседания, становая тяга и жим лежа активируют больше мышечных групп и стимулируют выработку гормона роста.',
      type: 'workout',
    });
  } else if (goal === 'get_ripped') {
    recommendations.push({
      id: 'hiit',
      title: 'Попробуйте HIIT тренировки',
      description: 'Интервальные тренировки высокой интенсивности помогают сжигать больше калорий за меньшее время.',
      type: 'workout',
    });
  } else if (goal === 'maintain') {
    recommendations.push({
      id: 'variety',
      title: 'Разнообразьте тренировки',
      description: 'Чередуйте кардио, силовые и гибкость для поддержания общей физической формы.',
      type: 'workout',
    });
  }

  return recommendations.slice(0, 3); // Возвращаем только 3 рекомендации
};

const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => (
  <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${typeColors[recommendation.type]}`}>
        {typeLabels[recommendation.type]}
      </span>
    </div>
    <h3 className="text-lg font-medium">{recommendation.title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mt-1">{recommendation.description}</p>
  </div>
);

const Recommendations: React.FC = () => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Анализируем данные пользователя
    const workoutCount = currentUser.workoutHistory.length;
    const hasWeightData = currentUser.progress.length > 0;
    
    let weightTrend: 'gain' | 'loss' | 'stable' | 'unknown' = 'unknown';
    if (currentUser.progress.length >= 2) {
      const latestWeight = currentUser.progress[currentUser.progress.length - 1].weight;
      const previousWeight = currentUser.progress[currentUser.progress.length - 2].weight;
      const diff = latestWeight - previousWeight;
      
      if (Math.abs(diff) < 0.5) {
        weightTrend = 'stable';
      } else if (diff > 0) {
        weightTrend = 'gain';
      } else {
        weightTrend = 'loss';
      }
    }

    // Получаем рекомендации на основе данных
    const userRecommendations = getRecommendations(
      workoutCount,
      hasWeightData,
      weightTrend,
      currentUser.currentGoal
    );

    setRecommendations(userRecommendations);
  }, [currentUser]);

  if (!currentUser || recommendations.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <FiInfo className="mr-2 text-soviet-red" size={20} />
        <h2 className="text-xl font-semibold">Персональные рекомендации</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations; 