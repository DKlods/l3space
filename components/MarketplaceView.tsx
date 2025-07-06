import React from 'react';
import { MarketplaceItem } from '../types';

const EquipmentIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.4 14.4 9.6 9.6m4.8 0-4.8 4.8M18.657 5.343a2 2 0 1 0-2.829-2.829l-1.414 1.414m2.829 2.829-1.414-1.414m0 0-1.414 1.414m2.829 2.829-1.414-1.414M6.757 17.243a2 2 0 1 0-2.829-2.829l1.414-1.414m2.829 2.829-1.414-1.414m0 0 1.414-1.414m2.829 2.829-1.414-1.414m-1.414-2.829 1.414-1.414" /></svg>);
const CartIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 0 0 7.5 18H18a2 2 0 0 0 1.85-2.7L17 13H7Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>);

const MARKETPLACE_LINKS = {
    'ozon': 'https://www.ozon.ru/search/?text=',
    'yandex_market': 'https://market.yandex.ru/search?text=',
    'samokat': 'https://samokat.ru/', // Samokat doesn't have a direct search URL like others
};

interface MarketplaceViewProps {
    equipment: MarketplaceItem[];
    shoppingList: MarketplaceItem[];
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ equipment, shoppingList }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-light-primary dark:bg-dark-tertiary p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <EquipmentIcon className="w-6 h-6 mr-3 text-soviet-red" />
                    Необходимый инвентарь
                </h3>
                {equipment.length > 0 ? (
                    <ul className="space-y-3">
                        {equipment.map((item, index) => (
                            <li key={index} className="bg-light-secondary dark:bg-dark-primary p-3 rounded-md flex justify-between items-center">
                                <span className="font-semibold text-text-dark-primary dark:text-text-light-primary">{item.name}</span>
                                <div className="flex gap-2">
                                     <a href={`${MARKETPLACE_LINKS.yandex_market}${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 transition-colors">Маркет</a>
                                    <a href={`${MARKETPLACE_LINKS.ozon}${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">Ozon</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-text-dark-secondary dark:text-text-light-secondary">Для ваших тренировок не требуется специальный инвентарь.</p>
                )}
            </div>

            <div className="bg-light-primary dark:bg-dark-tertiary p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <CartIcon className="w-6 h-6 mr-3 text-soviet-red" />
                    Список продуктов на неделю
                </h3>
                 {shoppingList.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {shoppingList.map((item, index) => (
                           <li key={index} className="bg-light-secondary dark:bg-dark-primary p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <span className="font-semibold text-text-dark-primary dark:text-text-light-primary">{item.name}</span>
                                    <span className="text-sm text-text-dark-secondary dark:text-text-light-secondary ml-2">{item.amount}</span>
                                </div>
                                 <div className="flex gap-2">
                                     <a href={`${MARKETPLACE_LINKS.samokat}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 transition-colors">Самокат</a>
                                    <a href={`${MARKETPLACE_LINKS.yandex_market}${encodeURIComponent(item.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500 transition-colors">Маркет</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-text-dark-secondary dark:text-text-light-secondary">Список покупок не сформирован.</p>
                )}
            </div>
        </div>
    );
};

export default MarketplaceView;
