
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ProcessingControls from './components/ProcessingControls';
import ResultList from './components/ResultList';
import { AppState, ProcessingMode, ImageResult } from './types';
import { geminiService, fileToBase64, AppError } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    analyzing: false,
    processing: false,
    imageDescription: '',
    suggestedPrompt: '',
    results: [],
    error: null,
  });

  const handleImageSelected = async (file: File) => {
    // Reset state for new image
    setState(prev => ({ 
      ...prev, 
      originalImage: URL.createObjectURL(file), 
      analyzing: true,
      error: null 
    }));

    try {
      const base64 = await fileToBase64(file);
      const analysis = await geminiService.analyzeImage(base64);
      
      setState(prev => ({
        ...prev,
        analyzing: false,
        imageDescription: analysis.description,
        suggestedPrompt: analysis.prompt
      }));
    } catch (err: any) {
      console.error('Analysis failed:', err);
      let errorMsg = '暖暖没能看清这张图，或许你可以换一张更清晰的？ (｡•ˇ‸ˇ•｡)';
      
      if (err instanceof AppError) {
        errorMsg = err.message;
      }
      
      setState(prev => ({ 
        ...prev, 
        analyzing: false, 
        error: errorMsg
      }));
    }
  };

  const handleProcess = async (mode: ProcessingMode) => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, processing: true, error: null }));

    try {
      let resultUrl = '';
      
      if (mode === ProcessingMode.DIRECT) {
        const response = await fetch(state.originalImage);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        const base64 = await fileToBase64(file);
        resultUrl = await geminiService.directDeWatermark(base64);
      }

      const newResult: ImageResult = {
        id: Math.random().toString(36).substr(2, 9),
        url: resultUrl,
        mode: mode,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        processing: false,
        results: [newResult, ...prev.results]
      }));
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      console.error('Processing failed:', err);
      let errorMsg = `糟糕！魔法暂时失效了: ${err.message || '净化失败'}`;
      
      if (err instanceof AppError) {
        errorMsg = err.message;
      }

      setState(prev => ({ 
        ...prev, 
        processing: false, 
        error: errorMsg 
      }));
    }
  };

  return (
    <div className="relative min-h-screen py-6 px-4">
      <Header />
      
      <main className="max-w-5xl mx-auto py-10">
        <section className="text-center mb-12 animate__animated animate__fadeIn">
          <div className="inline-block px-4 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-full text-xs font-black uppercase tracking-tighter mb-4 shadow-sm">
            Powered by 暖暖
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 anime-title leading-tight">
            让每一份画作 <br className="md:hidden" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 dark:from-pink-400 dark:to-indigo-300">
              重归无瑕之境
            </span> ✨
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            欢迎来到暖暖の去水印小站！在这里，我们运用强大的 AI 魔法，为您精准抹去干扰画作的水印，还原最纯净的次元之美。
          </p>
        </section>

        {state.error && (
          <div className="mb-10 p-5 glass-panel bg-red-50/90 dark:bg-red-900/20 border-l-8 border-red-400 text-red-700 dark:text-red-300 rounded-2xl flex items-center animate__animated animate__shakeX">
            <i className="fas fa-face-sad-tear mr-4 text-2xl text-red-500"></i>
            <div className="flex-1">
              <span className="font-bold block">{state.error}</span>
              <p className="text-xs mt-1 opacity-70 italic">你可以尝试刷新页面或者更换一张图片试试看 ~</p>
            </div>
            <button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="ml-4 p-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-full transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="animate__animated animate__zoomIn">
           <ImageUploader 
            currentImage={state.originalImage} 
            onImageSelected={handleImageSelected} 
            isAnalyzing={state.analyzing} 
          />
        </div>

        {state.originalImage && !state.analyzing && (
          <div className="animate__animated animate__fadeInUp">
            <ProcessingControls 
              onProcess={handleProcess}
              disabled={state.processing}
            />
          </div>
        )}

        {state.processing && (
          <div className="fixed inset-0 bg-pink-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <div className="glass-panel bg-white/95 dark:bg-slate-800/95 rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500"></div>
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-8 border-pink-100 dark:border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-hat-wizard text-5xl text-pink-500 animate__animated animate__pulse animate__infinite"></i>
                </div>
              </div>
              <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-4 anime-title">正在施展净化咒...</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold italic">
                “隐藏在次元中的力量啊，请听从暖暖的召唤，<br/>抹去凡世的尘埃吧！”
              </p>
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <ResultList results={state.results} />
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-pink-100/30 dark:border-white/10 pt-10 pb-20 text-center">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="h-px w-12 bg-pink-300 dark:bg-pink-800"></div>
          <span className="anime-title text-pink-500 dark:text-pink-400 font-bold text-xl">暖暖のSecret Garden</span>
          <div className="h-px w-12 bg-pink-300 dark:bg-pink-800"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold flex items-center justify-center">
          用心感知美，用 AI 创造美。
          <i className="fas fa-heart text-pink-500 mx-2 animate-pulse"></i>
          Created by <span className="underline decoration-pink-300 underline-offset-4 ml-1">暖暖</span>
        </p>
      </footer>

      {/* Floating Status Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-2xl border-2 border-pink-100 dark:border-pink-900/50 px-8 py-3 rounded-full flex items-center space-x-8 z-40 animate__animated animate__slideInUp">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">暖暖 Lab Online</span>
        </div>
        <div className="h-4 w-px bg-pink-200 dark:bg-pink-900"></div>
        <div className="flex space-x-6 text-[11px] font-black text-pink-600 dark:text-pink-400 uppercase">
          <span className="flex items-center hover:scale-110 transition-transform cursor-help"><i className="fas fa-wand-sparkles mr-1.5"></i> 纯净提取</span>
        </div>
      </div>
    </div>
  );
};

export default App;
