import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';
import AuthLayout from './AuthLayout';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const { navigate } = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            // The App component will handle navigation on currentUser change
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка входа.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-light-primary">Вход в аккаунт</h2>
                <p className="text-text-light-secondary mt-1">Добро пожаловать обратно, товарищ!</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-light-secondary">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-light-secondary">Пароль</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red" />
                </div>

                <div className="h-5">
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>

                <div>
                    <button type="submit" disabled={isLoading} className="w-full bg-soviet-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:bg-gray-500">
                        {isLoading ? 'Входим...' : 'Войти'}
                    </button>
                </div>
                <div className="text-center">
                    <p className="text-sm text-text-light-secondary">
                        Нет аккаунта?{' '}
                        <button type="button" onClick={() => navigate('/register')} className="font-medium text-soviet-red hover:underline">
                            Зарегистрироваться
                        </button>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}

export default LoginPage;