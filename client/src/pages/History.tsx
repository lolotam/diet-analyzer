import { useEffect, useState } from 'react';
import { getHistory } from '../api';
import { useTranslation } from 'react-i18next';

const History = () => {
  const { t } = useTranslation();
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    getHistory().then(setScans);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('history')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scans.map((scan) => (
          <div key={scan.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={`http://localhost:3002${scan.image_path}`} alt={scan.food_name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-xl mb-1 dark:text-white">{scan.food_name}</h3>
              <div className="text-sm text-gray-500 mb-3">{new Date(scan.created_at).toLocaleDateString()}</div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-red-600">{scan.calories} kcal</span>
                <span className="text-gray-600 dark:text-gray-400">P: {scan.protein}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;