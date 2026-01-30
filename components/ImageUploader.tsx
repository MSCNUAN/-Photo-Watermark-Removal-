
import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  currentImage: string | null;
  isAnalyzing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, currentImage, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  // Simulate analysis progress for better UX
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 35) return prev + Math.random() * 5; // Fast "upload" phase
          if (prev < 92) return prev + Math.random() * 0.8; // Slow "analysis" phase
          return prev;
        });
      }, 150);
    } else if (progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 800);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleContainerClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={`relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] border-4 border-dashed overflow-hidden transition-all cursor-pointer group glass-panel
        ${currentImage ? 'border-pink-400' : 'border-pink-200 hover:border-pink-400 bg-white/30'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {currentImage ? (
        <div className="w-full h-full relative p-4">
          <img 
            src={currentImage} 
            alt="Original" 
            className={`w-full h-full object-contain rounded-2xl bg-white/20 shadow-inner transition-all duration-500 ${isAnalyzing ? 'brightness-50 grayscale-[0.3] blur-[1px]' : ''}`} 
          />
          
          <div className="absolute inset-0 bg-pink-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-20">
            {!isAnalyzing && (
              <div className="bg-white/90 px-6 py-3 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                <p className="text-pink-600 font-bold flex items-center">
                  <i className="fas fa-camera-rotate mr-2 text-xl"></i> 换一张试试？
                </p>
              </div>
            )}
          </div>

          {/* Analysis Overlay */}
          {(isAnalyzing || (progress > 0 && progress < 100)) && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm overflow-hidden rounded-[2rem]">
              {/* Scan Line Animation */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
              
              <div className="relative mb-6">
                 <div className="w-24 h-24 border-4 border-pink-200/20 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <i className="fas fa-microchip text-2xl text-pink-500 animate-pulse"></i>
                 </div>
              </div>

              <div className="text-center px-6">
                <h4 className="text-white font-bold text-xl anime-title mb-1 tracking-wider">
                  次元扫描中...
                </h4>
                <p className="text-pink-300 font-bold text-xs uppercase tracking-[0.3em] opacity-80 mb-6">
                  {progress < 35 ? 'Initiating Data Link' : 'Gemini Subspace Analysis'}
                </p>
                
                {/* Progress Bar Container */}
                <div className="w-64 sm:w-80 h-3 bg-black/40 rounded-full p-[2px] border border-white/10 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 rounded-full transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Glowing head of the bar */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white blur-md opacity-60"></div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-[10px] font-black text-pink-200 uppercase tracking-widest">
                  <span>Progress</span>
                  <span className="text-sm text-white">{Math.floor(progress)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Flash */}
          {progress === 100 && (
             <div className="absolute inset-0 z-40 bg-white/40 backdrop-blur-sm flex items-center justify-center animate__animated animate__fadeOut animate__delay-1s rounded-[2rem]">
                <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] animate__animated animate__zoomIn">
                  <i className="fas fa-check text-3xl text-white"></i>
                </div>
             </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-inner">
            <i className="fas fa-cloud-arrow-up text-4xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 anime-title mb-2">把画卷交给暖暖吧！</h3>
          <p className="text-pink-400 font-bold mb-4">点击此处上传有水印的图片</p>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-pink-500 uppercase">JPG</span>
            <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-pink-500 uppercase">PNG</span>
            <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-pink-500 uppercase">WEBP</span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default ImageUploader;
