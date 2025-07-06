import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Типы данных для графика
type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
};

// Типы метрик, которые можно отображать
type MetricType = 'weight' | 'bodyFat' | 'musclePercentage';

const metricLabels = {
  weight: 'Вес (кг)',
  bodyFat: 'Процент жира (%)',
  musclePercentage: 'Мышечная масса (%)',
};

const ProgressChart: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeMetric, setActiveMetric] = useState<MetricType>('weight');

  if (!currentUser || currentUser.progress.length < 2) {
    return (
      <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Прогресс</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Для отображения графика прогресса необходимо как минимум две записи о прогрессе.
        </p>
      </div>
    );
  }

  // Подготавливаем данные для графика
  const prepareChartData = (): ChartData => {
    const sortedProgress = [...currentUser.progress].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedProgress.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate()}.${date.getMonth() + 1}`;
    });

    let data: number[] = [];
    switch (activeMetric) {
      case 'weight':
        data = sortedProgress.map(entry => entry.weight);
        break;
      case 'bodyFat':
        data = sortedProgress.map(entry => entry.bodyFat || 0);
        break;
      case 'musclePercentage':
        data = sortedProgress.map(entry => entry.musclePercentage || 0);
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: metricLabels[activeMetric],
          data,
          borderColor: activeMetric === 'weight' ? '#E53E3E' : 
                       activeMetric === 'bodyFat' ? '#3182CE' : '#38A169',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          tension: 0.3,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика прогресса',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Прогресс</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeMetric === 'weight'
                ? 'bg-soviet-red text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setActiveMetric('weight')}
          >
            Вес
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeMetric === 'bodyFat'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setActiveMetric('bodyFat')}
          >
            % жира
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeMetric === 'musclePercentage'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => setActiveMetric('musclePercentage')}
          >
            % мышц
          </button>
        </div>
      </div>
      <div className="h-64">
        <Line options={chartOptions} data={prepareChartData()} />
      </div>
    </div>
  );
};

export default ProgressChart;