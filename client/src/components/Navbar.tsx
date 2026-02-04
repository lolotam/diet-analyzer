import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Languages, History, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <Camera className="w-8 h-8" />
          {t('app_title')}
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/history" className="text-gray-600 dark:text-gray-300 hover:text-green-600">
            <History className="w-6 h-6" />
          </Link>
          
          <button onClick={toggleLang} className="text-gray-600 dark:text-gray-300 hover:text-green-600">
            <Languages className="w-6 h-6" />
          </button>
          
          <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 hover:text-yellow-500">
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;