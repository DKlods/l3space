
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Progress } from '../types';

const ProfileSetup: React.FC = () => {
    const { currentUser, updateUser, addProgress } = useAuth();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        gender: '',
        age: '',
        height: '',
        weight: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError(''); // Clear error on change
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, gender, age, height, weight } = formData;
        
        if (!name || !gender || !age || !height || !weight) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        const ageNum = parseInt(age, 10);
        const heightNum = parseInt(height, 10);
        const weightNum = parseFloat(weight);

        if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum) || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
            setError('Пожалуйста, введите корректные числовые значения.');
            return;
        }
        
        const userData: Partial<User> = {
            name,
            gender: gender as User['gender'],
            age: ageNum,
            height: heightNum,
            isProfileComplete: true,
        };

        const progressData: Omit<Progress, 'date'> = {
            weight: weightNum
        };

        updateUser(userData);
        addProgress(progressData);
    };

    return (
        <div className="min-h-screen bg-dark-primary text-text-light-primary flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-dark-secondary rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-light-primary">Настройка профиля</h1>
                    <p className="text-text-light-secondary mt-2">Расскажите нам о себе, чтобы мы могли создать идеальный план.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-light-secondary">Ваше имя</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"
                            placeholder="Товарищ"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-text-light-secondary">Пол</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red">
                                <option value="" disabled>Выберите...</option>
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                                <option value="other">Другой</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-text-light-secondary">Возраст</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} placeholder="лет" className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-text-light-secondary">Рост (см)</label>
                            <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} placeholder="см" className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-text-light-secondary">Текущий вес (кг)</label>
                            <input type="number" step="0.1" name="weight" id="weight" value={formData.weight} onChange={handleChange} placeholder="кг" className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                        </div>
                    </div>

                    <div className="h-5">
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </div>

                    <div>
                        <button type="submit" className="w-full bg-soviet-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
                            Сохранить и продолжить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;