
import React from 'react';
import { ProcessingMode } from '../types';

interface ProcessingControlsProps {
  onProcess: (mode: ProcessingMode) => void;
  disabled: boolean;
}

const ProcessingControls: React.FC<ProcessingControlsProps> = ({ 
  onProcess, 
  disabled
}) => {
  return (
    <div className="mt-10 flex justify-center">
      {/* Only Option: Direct */}
      <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col max-w-xl w-full border-b-8 border-blue-400 relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <i className="fas fa-wand-magic text-2xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">魔法擦除</h3>
            <p className="text-xs text-blue-400 font-bold">Direct De-watermark</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          保留原画的每一丝神韵，暖暖会用精准的橡皮擦除那些碍眼的水印标记。✨
        </p>
        <button
          disabled={disabled}
          onClick={() => onProcess(ProcessingMode.DIRECT)}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-200 kawaii-button"
        >
          <i className="fas fa-sparkles"></i>
          <span>开始魔法净化 ✧</span>
        </button>
      </div>
    </div>
  );
};

export default ProcessingControls;
