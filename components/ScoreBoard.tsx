import React, { useEffect, useState } from 'react';
import { Flame } from './icons';

interface ScoreBoardProps {
  score: number;
  combo: number;
  currentQuestion: number;
  totalQuestions: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, combo, currentQuestion, totalQuestions }) => {
  const [animateCombo, setAnimateCombo] = useState(false);

  useEffect(() => {
    if (combo > 1) {
      setAnimateCombo(true);
      const timer = setTimeout(() => setAnimateCombo(false), 500);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-slate-800/50 backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <div className="text-left">
          <div className="text-slate-400 text-sm">점수</div>
          <div className="text-3xl font-bold text-white">{score}</div>
        </div>
        
        {combo >= 2 && (
          <div className={`flex items-center space-x-2 text-2xl font-bold text-orange-400 transition-transform duration-500 ease-out ${animateCombo ? 'scale-150' : 'scale-100'}`}>
            <Flame className="w-7 h-7" />
            <span>{combo} 콤보</span>
          </div>
        )}
        
        <div className="text-right">
          <div className="text-slate-400 text-sm">문제</div>
          <div className="text-3xl font-bold text-white">
            <span className="text-purple-400">{currentQuestion}</span> / {totalQuestions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;