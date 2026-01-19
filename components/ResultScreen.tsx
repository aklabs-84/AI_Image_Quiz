import React, { useState, useEffect } from 'react';
import type { Answer, Question } from '../types';
import { CheckCircle, XCircle, RotateCw } from './icons';

const getGradeMessage = (score: number) => {
  if (score > 25) return { grade: "AI 비전가", message: "당신의 통찰력은 인간을 넘어섰습니다! 멀리서도 AI를 식별할 수 있군요.", color: "text-purple-400" };
  if (score > 15) return { grade: "미술 탐정", message: "훌륭해요! 디지털의 디테일을 꿰뚫어보는 날카로운 눈을 가졌습니다.", color: "text-green-400" };
  if (score > 5) return { grade: "호기심 많은 관찰자", message: "좋은 시작입니다! 인간과 AI의 경계는 점점 흐려지고 있습니다.", color: "text-yellow-400" };
  return { grade: "인간미 감정가", message: "모든 것에서 인간의 손길을 느끼는군요! 계속 연습해보세요.", color: "text-orange-400" };
};

const useCountUp = (end: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const startTime = Date.now();

        const animateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * end);
            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [end, duration]);

    return count;
};

interface ReviewItemProps {
  question: Question;
  answer: Answer;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ question, answer }) => {
  return (
    <div className="bg-slate-700/50 p-4 rounded-lg">
      <h3 className="font-bold text-lg mb-3 text-slate-300">문제 {question.id}: {question.style}</h3>
      <div className="grid grid-cols-2 gap-4">
        {question.images.map(img => (
          <div key={img.id} className="relative">
            <img src={img.url} alt={`Review ${question.id}-${img.id}`} className="rounded-md w-full aspect-square object-cover" />
            <div className={`absolute inset-0 rounded-md border-4 ${img.id === question.correctAnswer ? 'border-green-500' : 'border-transparent'}`}>
              {img.id === question.correctAnswer && <span className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">AI 그림</span>}
              {answer.userAnswer === img.id && (
                <div className={`absolute bottom-1 right-1 rounded-full p-1 ${answer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {answer.isCorrect ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-600">
        <p className="text-sm text-yellow-300 font-semibold mb-1">💡 AI 단서:</p>
        <p className="text-sm text-slate-300">{question.explanation}</p>
      </div>
    </div>
  );
};

interface ResultScreenProps {
  score: number;
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, answers, questions, onRestart }) => {
  const gradeInfo = getGradeMessage(score);
  const displayedScore = useCountUp(score);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 100); // Trigger animation after mount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Score and Grade Section */}
      <div className={`w-full md:w-1/3 flex flex-col items-center justify-center p-8 bg-slate-800 border-b-2 md:border-b-0 md:border-r-2 border-slate-700 transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
        <h2 className="text-2xl text-slate-400 mb-2">최종 점수</h2>
        <p className="text-8xl font-black text-white mb-6">{displayedScore}</p>
        <div className={`transition-all duration-500 delay-500 ease-in-out ${isAnimating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'} text-center`}>
          <p className={`text-4xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.grade}</p>
          <p className="text-slate-300 text-center max-w-xs">{gradeInfo.message}</p>
        </div>
        <button
          onClick={onRestart}
          className={`mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg flex items-center space-x-2 delay-700 ${isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
        >
          <RotateCw className="w-5 h-5" />
          <span>다시하기</span>
        </button>
      </div>

      {/* Review Section */}
      <div className="w-full md:w-2/3 p-8 overflow-y-auto">
        <h2 className={`text-3xl font-bold text-center mb-6 transition-opacity duration-500 delay-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>퀴즈 리뷰</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {questions.map((q, index) => (
            <div 
              key={q.id} 
              className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'}`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              {answers[index] && <ReviewItem question={q} answer={answers[index]} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;