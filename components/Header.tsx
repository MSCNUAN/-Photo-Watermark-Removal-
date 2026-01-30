
import React, { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    const shouldBeDark = hours >= 18 || hours < 6;
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 py-4 px-2 md:px-6 mb-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-panel rounded-2xl md:rounded-3xl px-4 md:px-8 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          <div className="bg-gradient-to-tr from-pink-500 to-purple-600 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
            <i className="fas fa-wand-magic-sparkles text-lg md:text-xl"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-2xl font-bold anime-title bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-700 dark:from-pink-400 dark:to-purple-300 leading-tight">
              暖暖の去水印小站
            </h1>
            <p className="text-[8px] md:text-[10px] text-pink-400 font-bold tracking-widest uppercase dark:text-pink-300">Intelligent Image Master</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-3 md:space-x-6">
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[13px] xl:text-sm font-bold text-gray-600 dark:text-gray-300">
            <a 
              href="http://www.nuan1145.eu.cc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center group"
            >
              <i className="fas fa-blog mr-1.5 group-hover:rotate-12 transition-transform"></i> 个人博客
            </a>
            <a 
              href="https://nuannuan-tools.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center group"
            >
              <i className="fas fa-box-archive mr-1.5 group-hover:rotate-12 transition-transform"></i> 资源导航
            </a>
            <a 
              href="https://t.me/NUAN114514" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center group"
            >
              <i className="fab fa-telegram-plane mr-1.5 group-hover:rotate-12 transition-transform"></i> TG频道
            </a>
            <a 
              href="https://t.me/MSC4652" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center group"
            >
              <i className="fas fa-comment-dots mr-1.5 group-hover:rotate-12 transition-transform"></i> TG群组
            </a>
          </nav>

          <button 
            onClick={toggleDarkMode}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-pink-100 dark:bg-slate-700 text-pink-600 dark:text-yellow-400 hover:scale-110 transition-all duration-300 shadow-sm border border-pink-200 dark:border-slate-600 shrink-0"
            title={isDark ? "切换到白昼模式" : "切换到极夜模式"}
          >
            <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'} text-base md:text-lg animate__animated ${isDark ? 'animate__fadeIn' : 'animate__rotateIn'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
