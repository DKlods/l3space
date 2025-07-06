import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { apiClient } from '../lib/apiClient';

interface EditableFieldProps {
  label: string;
  value: string | number;
  type?: string;
  onSave: (value: string | number) => Promise<void>;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  type = 'text',
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(currentValue);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {isEditing ? (
        <div className="flex items-center">
          <input
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soviet-red focus:border-soviet-red dark:bg-dark-primary"
            disabled={isSaving}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="ml-2 p-2 text-soviet-red hover:bg-soviet-red hover:bg-opacity-10 rounded-full"
            aria-label="Сохранить"
          >
            {isSaving ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <FiSave />
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="ml-1 p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            aria-label="Отменить"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            {value}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            aria-label="Редактировать"
          >
            <FiEdit2 />
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const UserProfile: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) return null;

  const handleUpdateField = async (field: string, value: string | number) => {
    try {
      setIsLoading(true);
      const response = await apiClient.updateUser(currentUser.id, { [field]: value });
      updateCurrentUser(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Профиль пользователя</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <EditableField
            label="Имя"
            value={currentUser.name}
            onSave={(value) => handleUpdateField('name', value)}
          />
          
          <EditableField
            label="Email"
            value={currentUser.email}
            type="email"
            onSave={(value) => handleUpdateField('email', value as string)}
          />
          
          <EditableField
            label="Возраст"
            value={currentUser.age || 0}
            type="number"
            onSave={(value) => handleUpdateField('age', Number(value))}
          />
        </div>
        
        <div>
          <EditableField
            label="Рост (см)"
            value={currentUser.height || 0}
            type="number"
            onSave={(value) => handleUpdateField('height', Number(value))}
          />
          
          <EditableField
            label="Вес (кг)"
            value={currentUser.weight || 0}
            type="number"
            onSave={(value) => handleUpdateField('weight', Number(value))}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Цель
            </label>
            <select
              value={currentUser.currentGoal || ''}
              onChange={(e) => handleUpdateField('currentGoal', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-soviet-red focus:border-soviet-red dark:bg-dark-primary"
              disabled={isLoading}
            >
              <option value="">Выберите цель</option>
              <option value="get_ripped">Похудение</option>
              <option value="gain_mass">Набор массы</option>
              <option value="maintain">Поддержание формы</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 