
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.95-4.243-1.591 1.591M5.25 12H3m4.243-4.95-1.591-1.591M12 6.75a5.25 5.25 0 0 0-5.25 5.25H12V6.75Z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);


const ThemeSwitcher: React.FC = () => {
    const { currentUser, toggleTheme } = useAuth();

    if (!currentUser) return null;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-dark-secondary dark:text-text-light-secondary hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
            aria-label={`Switch to ${currentUser.settings.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {currentUser.settings.theme === 'dark' ? (
                <SunIcon className="w-6 h-6" />
            ) : (
                <MoonIcon className="w-6 h-6" />
            )}
        </button>
    );
};

export default ThemeSwitcher;