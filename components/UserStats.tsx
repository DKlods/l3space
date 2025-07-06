import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiActivity, FiAward, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-4 shadow-sm flex items-center">
    <div className={`rounded-full p-3 ${color} mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const UserStats: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Вычисляем статистику
  const totalWorkouts = currentUser.workoutHistory.length;
  
  const completedChallenges = currentUser.dailyChallenges.filter(
    challenge => challenge.completed
  ).length;
  
  const totalChallenges = currentUser.dailyChallenges.length;
  
  const streakDays = 3; // В будущем будет вычисляться из истории тренировок
  
  // Вычисляем прогресс в весе, если есть записи
  let weightProgress = "Нет данных";
  if (currentUser.progress.length >= 2) {
    const latestWeight = currentUser.progress[currentUser.progress.length - 1].weight;
    const firstWeight = currentUser.progress[0].weight;
    const diff = latestWeight - firstWeight;
    weightProgress = `${diff > 0 ? "+" : ""}${diff.toFixed(1)} кг`;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Ваша статистика</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Всего тренировок" 
          value={totalWorkouts} 
          icon={<FiActivity className="text-white" size={20} />} 
          color="bg-blue-500"
        />
        <StatsCard 
          title="Челленджи" 
          value={`${completedChallenges}/${totalChallenges}`} 
          icon={<FiAward className="text-white" size={20} />} 
          color="bg-green-500"
        />
        <StatsCard 
          title="Текущая серия" 
          value={`${streakDays} дн.`} 
          icon={<FiCalendar className="text-white" size={20} />} 
          color="bg-purple-500"
        />
        <StatsCard 
          title="Прогресс веса" 
          value={weightProgress} 
          icon={<FiTrendingUp className="text-white" size={20} />} 
          color="bg-soviet-red"
        />
      </div>
    </div>
  );
};

export default UserStats; 