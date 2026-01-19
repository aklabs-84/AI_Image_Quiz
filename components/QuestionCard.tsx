
import React, { useState } from 'react';
import type { Question } from '../types';
import { CheckCircle, XCircle, ZoomIn } from './icons';
import ImageModal from './ImageModal';

interface ImageOptionProps {
  id: 'A' | 'B';
  url: string;
  onSelect: (id: 'A' | 'B') => void;
  onImageClick: (url: string) => void;
  disabled: boolean;
}

const ImageOption: React.FC<ImageOptionProps> = ({ id, url, onSelect, onImageClick, disabled }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center group w-full">
      <div 
        className={`relative w-full max-h-[35vh] sm:max-h-[40vh] aspect-square overflow-hidden rounded-2xl shadow-xl mb-4 cursor-pointer bg-slate-800 transition-all duration-700 ring-1 ring-white/10 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={() => onImageClick(url)}
        role="button"
        aria-label={`View image ${id} in full screen`}
      >
        <img 
          src={url} 
          alt={`Option ${id}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[3px]">
            <ZoomIn className="w-14 h-14 text-white drop-shadow-2xl transition-transform duration-500 transform group-hover:scale-110" />
        </div>
      </div>
      {!isLoaded && <div className="w-full aspect-square max-h-[40vh] bg-slate-800/50 rounded-2xl animate-pulse mb-4 flex flex-col items-center justify-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-sm font-bold tracking-tight">이미지 생성 완료 중...</span>
      </div>}
      <button
        onClick={() => onSelect(id)}
        disabled={disabled || !isLoaded}
        className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 disabled:bg-slate-800/50 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-2xl text-xl transition-all duration-300 transform active:scale-95 shadow-xl border border-white/5"
      >
        선택 {id}
      </button>
    </div>
  );
};

interface FeedbackAnimationProps {
  isCorrect: boolean | null;
  pointsEarned: number;
  explanation: string;
  onNext: () => void;
  isLastQuestion: boolean;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({ isCorrect, pointsEarned, explanation, onNext, isLastQuestion }) => {
  if (isCorrect === null) return null;

  const animationClass = isCorrect ? 'animate-scale-in' : 'animate-shake';
  const bgColor = isCorrect ? 'bg-green-600/95' : 'bg-red-600/95';
  const Icon = isCorrect ? CheckCircle : XCircle;
  const text = isCorrect ? '정답입니다!' : '오답입니다!';

  return (
    <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center rounded-3xl ${bgColor} ${animationClass} p-4 md:p-8 text-white backdrop-blur-2xl shadow-2xl border border-white/20 overflow-hidden`}>
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out forwards; }
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.6s forwards; opacity: 0; }
      `}</style>
      
      <div className="flex flex-col items-center justify-center w-full max-h-full space-y-2 md:space-y-4">
        <Icon className="w-12 h-12 md:w-20 md:h-20 drop-shadow-lg shrink-0" />
        <h2 className="text-3xl md:text-5xl font-black drop-shadow-md text-center tracking-tighter shrink-0">{text}</h2>
        
        {isCorrect && pointsEarned > 0 && (
          <p className="text-xl md:text-3xl font-black text-yellow-300 animate-bounce shrink-0">+ {pointsEarned} PTS</p>
        )}
        {!isCorrect && (
          <p className="text-lg md:text-2xl font-bold opacity-90 text-center shrink-0">이것은 AI가 그린 이미지입니다.</p>
        )}

        <div className="p-4 md:p-6 bg-black/40 rounded-2xl max-w-2xl w-full text-center border border-white/10 animate-fade-in-up flex flex-col items-center overflow-hidden">
          <h3 className="font-black text-lg md:text-xl mb-2 text-yellow-400 flex items-center justify-center gap-2 shrink-0">
            <span className="text-xl md:text-2xl">🔍</span> 판별 단서
          </h3>
          <p className="text-sm md:text-lg leading-relaxed font-medium text-slate-50 overflow-y-auto custom-scrollbar max-h-[15vh]">
            {explanation}
          </p>
        </div>

        <button
          onClick={onNext}
          className="mt-2 bg-white text-slate-900 hover:bg-slate-100 font-black py-3 px-10 md:py-4 md:px-14 rounded-full text-lg md:text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-2xl animate-fade-in-up shrink-0"
        >
          {isLastQuestion ? '최종 결과 확인' : '다음 라운드'}
        </button>
      </div>
    </div>
  );
};

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: 'A' | 'B') => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  pointsEarned: number;
  isSelectionDisabled: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, showFeedback, isCorrect, pointsEarned, isSelectionDisabled, onNext, isLastQuestion }) => {
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  
  const handleImageClick = (url: string) => {
    if (!isSelectionDisabled) {
        setZoomedImageUrl(url);
    }
  };

  const handleCloseModal = () => {
    setZoomedImageUrl(null);
  };
  
  return (
    <>
      {zoomedImageUrl && <ImageModal imageUrl={zoomedImageUrl} onClose={handleCloseModal} />}
      <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col relative py-6 px-4">
        {/* 스타일 뱃지와 타이틀은 항상 돋보기 확대 시 가려지도록 모달 하위에 배치됨 */}
        <div className="relative z-10 mb-8 text-center shrink-0">
          <div className="inline-block px-5 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 mb-4 animate-fade-in">
            <span className="text-purple-400 font-black text-base md:text-lg uppercase tracking-widest">{question.style}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight px-4 drop-shadow-2xl">
            어떤 작품이 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI의 작품</span>인가요?
          </h1>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 relative items-start">
          {showFeedback && (
            <FeedbackAnimation 
              isCorrect={isCorrect} 
              pointsEarned={pointsEarned} 
              explanation={question.explanation}
              onNext={onNext}
              isLastQuestion={isLastQuestion}
            />
          )}
          {question.images.map(img => (
            <ImageOption 
              key={img.id} 
              id={img.id} 
              url={img.url} 
              onSelect={onAnswer} 
              onImageClick={handleImageClick}
              disabled={isSelectionDisabled} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
