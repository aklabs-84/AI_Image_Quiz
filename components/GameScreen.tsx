import React, { useState, useCallback } from 'react';
import type { Answer, Question } from '../types';
import QuestionCard from './QuestionCard';
import ScoreBoard from './ScoreBoard';
import { playCorrectSound, playIncorrectSound } from '../sound';

interface GameScreenProps {
  questions: Question[];
  onFinish: (score: number, answers: Answer[]) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);

  const handleAnswer = useCallback((selectedOption: 'A' | 'B') => {
    if (showFeedback) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      playCorrectSound();
      const baseScore = 1;
      const bonusScore = combo >= 1 ? Math.pow(2, combo) : 0;
      const totalPoints = baseScore + bonusScore;
      
      setPointsEarned(totalPoints);
      setScore(prev => prev + totalPoints);
      setCombo(prev => prev + 1);
    } else {
      playIncorrectSound();
      setPointsEarned(0);
      setCombo(0);
    }

    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      userAnswer: selectedOption,
      isCorrect,
    }]);

    setShowFeedback(true);
  }, [currentQuestionIndex, combo, showFeedback, questions]);

  const handleNext = () => {
    setShowFeedback(false);
    setLastAnswerCorrect(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinish(score, answers);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null; // Or a loading state
  }
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col items-center justify-center h-full pt-24 pb-8 px-4">
      <ScoreBoard 
        score={score} 
        combo={combo}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
        isCorrect={lastAnswerCorrect}
        pointsEarned={pointsEarned}
        isSelectionDisabled={showFeedback}
        onNext={handleNext}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
};

export default GameScreen;