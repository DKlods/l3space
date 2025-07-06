import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UserProfile';
import ProgressChart from '../components/ProgressChart';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Необходимо авторизоваться
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Пожалуйста, войдите в систему для доступа к профилю.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Настройки профиля</h1>
        
        <div className="space-y-6">
          <UserProfile />
          
          <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">История прогресса</h2>
            <div className="h-80">
              <ProgressChart />
            </div>
          </div>
          
          <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Настройки приложения</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Тема
              </label>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded-md ${
                    currentUser.settings.theme === 'light' 
                      ? 'bg-soviet-red text-white' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onClick={() => {/* Функция смены темы */}}
                >
                  Светлая
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${
                    currentUser.settings.theme === 'dark' 
                      ? 'bg-soviet-red text-white' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onClick={() => {/* Функция смены темы */}}
                >
                  Тёмная
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Уведомления
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={currentUser.settings.notifications}
                  onChange={() => {/* Функция переключения уведомлений */}}
                  className="h-4 w-4 text-soviet-red focus:ring-soviet-red border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Включить уведомления
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Язык
              </label>
              <select
                value={currentUser.settings.language}
                onChange={() => {/* Функция смены языка */}}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soviet-red focus:border-soviet-red dark:bg-dark-primary"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 