
import React from 'react';
import { ImageResult, ProcessingMode } from '../types';

interface ResultListProps {
  results: ImageResult[];
}

const ResultList: React.FC<ResultListProps> = ({ results }) => {
  if (results.length === 0) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✨ 咒语已刻入脑海，快去二次创作吧！ (´▽`ʃ♡ƪ)');
  };

  return (
    <div className="mt-20 mb-12 animate__animated animate__fadeInUp">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white anime-title flex items-center">
          <span className="w-12 h-12 bg-pink-500 text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg rotate-3">
             <i className="fas fa-images"></i>
          </span>
          大师的魔法成果
        </h2>
        <div className="text-xs font-bold text-pink-400 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/30 px-4 py-2 rounded-full border border-pink-100 dark:border-pink-800">
          共收录 {results.length} 件珍品
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {results.map((result) => (
          <div key={result.id} className="glass-panel rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-white dark:border-slate-700 group hover:-translate-y-3 transition-all duration-500">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={result.url} 
                alt="Result" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-lg backdrop-blur-md border border-white/30 uppercase tracking-widest ${result.mode === ProcessingMode.DIRECT ? 'bg-blue-500/80' : 'bg-pink-600/80'}`}>
                  ✦ 魔法净化
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                <a 
                  href={result.url} 
                  download={`aria-magic-${result.id}.png`}
                  className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-2xl hover:bg-pink-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                >
                  <i className="fas fa-cloud-download mr-2"></i> 保存珍品
                </a>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <span>Magic ID: {result.id}</span>
                <span>{new Date(result.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultList;
