
import React, { ReactNode } from 'react';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark-primary text-text-light-primary flex flex-col items-center justify-center p-4 animate-fade-in">
             <div className="flex items-center mb-8">
                <StarIcon className="w-10 h-10 text-soviet-red mr-3" />
                <h1 className="text-4xl font-bold tracking-wider uppercase">
                    USSR<span className="text-soviet-red">.</span>Space
                </h1>
            </div>
            <div className="w-full max-w-md bg-dark-secondary rounded-xl shadow-2xl p-8">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
