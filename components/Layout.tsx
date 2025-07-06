import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiUser, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  const navItems = [
    { path: '/', icon: <FiHome size={20} />, label: 'Главная' },
    { path: '/profile', icon: <FiUser size={20} />, label: 'Профиль' },
    { path: '/stats', icon: <FiBarChart2 size={20} />, label: 'Статистика' },
    { path: '/settings', icon: <FiSettings size={20} />, label: 'Настройки' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text">
      {/* Верхняя навигация */}
      <header className="bg-light-secondary dark:bg-dark-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.svg"
                  alt="USSR.Space Logo"
                  className="h-8 w-auto mr-2"
                />
                <span className="text-xl font-bold text-soviet-red">USSR.Space</span>
              </Link>
            </div>

            {/* Мобильная навигация */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex space-x-4">
              {currentUser ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                  >
                    <FiLogOut size={20} className="mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-soviet-red text-white hover:bg-soviet-red-dark"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-light-secondary dark:bg-dark-secondary shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                >
                  <FiLogOut size={20} className="mr-2" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-soviet-red text-white hover:bg-soviet-red-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Основное содержимое */}
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Футер */}
      <footer className="bg-light-secondary dark:bg-dark-secondary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} USSR.Space. Все права защищены.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                О нас
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Контакты
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 