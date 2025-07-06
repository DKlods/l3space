
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface ProfileEditorProps {
    onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
    const { currentUser: user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        gender: user?.gender || '',
        age: user?.age?.toString() || '',
        height: user?.height?.toString() || '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setError(''); // Clear error on change
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, gender, age, height } = formData;

        if (!name || !gender || !age || !height) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        const ageNum = parseInt(age, 10);
        const heightNum = parseInt(height, 10);

        if (isNaN(ageNum) || isNaN(heightNum) || ageNum <= 0 || heightNum <= 0) {
            setError('Пожалуйста, введите корректные числовые значения.');
            return;
        }
        
        const userData: Partial<User> = {
            name,
            gender: gender as User['gender'],
            age: ageNum,
            height: heightNum,
        };
        
        updateUser(userData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-dark-primary/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-lg bg-dark-secondary rounded-xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-light-primary">Редактировать профиль</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                 </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-light-secondary">Ваше имя</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-text-light-secondary">Пол</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red">
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                                <option value="other">Другой</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-text-light-secondary">Возраст</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="height" className="block text-sm font-medium text-text-light-secondary">Рост (см)</label>
                        <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full bg-dark-tertiary border-dark-tertiary rounded-md p-3 text-text-light-primary focus:ring-soviet-red focus:border-soviet-red"/>
                    </div>
                    
                    <div className="h-5">
                      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-dark-tertiary text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                            Отмена
                        </button>
                        <button type="submit" className="bg-soviet-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditor;