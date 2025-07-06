import React from 'react';

interface ErrorMessageProps {
  message: string;
  onReset: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-100 dark:bg-red-900/50 border border-soviet-red text-red-700 dark:text-red-100 px-4 py-3 rounded-lg relative text-center" role="alert">
      <strong className="font-bold block">Ошибка!</strong>
      <span className="block sm:inline">{message}</span>
      <div className="mt-4">
        <button
            onClick={onReset}
            className="bg-light-secondary dark:bg-dark-secondary text-text-dark-primary dark:text-text-light-primary font-bold py-2 px-6 rounded hover:bg-gray-200 dark:hover:bg-dark-tertiary transition-colors duration-300"
        >
            Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;