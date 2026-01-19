
import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const loadingMessages = [
  "Gemini AI가 디지털 붓을 준비하고 있습니다...",
  "첫 번째 라운드의 이미지를 캔버스에 그리는 중...",
  "디테일한 텍스처를 AI가 학습하며 생성하고 있습니다...",
  "인간 화가의 화풍을 모방하기 위해 고민하는 중...",
  "거의 다 되었습니다! 마지막 터치를 가하는 중..."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const messageIndex = Math.min(
    Math.floor((progress / 100) * loadingMessages.length),
    loadingMessages.length - 1
  );

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="relative w-64 h-64 mb-12">
        {/* Animated AI Core Visualization */}
        <div className="absolute inset-0 bg-purple-600/20 rounded-full animate-ping"></div>
        <div className="absolute inset-4 bg-blue-600/30 rounded-full animate-pulse delay-75"></div>
        <div className="absolute inset-8 border-4 border-dashed border-purple-500 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-white">{Math.round(progress)}%</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
        AI가 퀴즈를 생성하고 있습니다
      </h2>
      
      <p className="text-xl text-slate-400 mb-8 max-w-md h-8">
        {loadingMessages[messageIndex]}
      </p>

      <div className="w-full max-w-md bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="mt-4 text-slate-500 text-sm">
        실시간으로 이미지를 생성하고 있습니다. 잠시만 기다려 주세요.
      </p>
    </div>
  );
};

export default LoadingScreen;
