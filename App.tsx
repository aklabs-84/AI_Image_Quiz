
import React, { useState, useCallback } from 'react';
import { GameStatus, Difficulty } from './types';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import type { Answer, Question } from './types';
import { QUIZ_TEMPLATES } from './constants';
import { initAudio, playResultSound } from './sound';
import { GoogleGenAI } from "@google/genai";
import { HelpCircle, X } from './components/icons';

type ModelMode = 'eco' | 'pro';

const API_KEY_STORAGE = 'gemini_api_key';

const GuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-y-auto max-h-[95%] custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-3 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-purple-500" />
            가이드 & 특징
          </h2>
          <p className="text-slate-300 text-lg font-medium leading-relaxed border-l-4 border-purple-500 pl-4 bg-purple-500/5 py-2 rounded-r-lg">
            Gemini AI가 실시간으로 생성한 작품과 실제 예술가의 작품을 구별하며 당신의 관찰력을 시험해보는 인터랙티브 퀴즈 게임입니다.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span className="bg-purple-500/20 px-2 py-0.5 rounded text-sm uppercase tracking-tighter">How to Play</span>
              이용 방법
            </h3>
            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">1</span>
                <p><span className="text-white font-bold">모델 및 난이도 선택:</span> 속도 중심의 Eco 또는 고화질 Pro 모델을 고르고 원하는 난이도를 설정하세요.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">2</span>
                <p><span className="text-white font-bold">AI 작품 찾기:</span> 화면에 나타나는 두 이미지 중 AI가 생성한 것으로 의심되는 이미지를 선택하세요.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">3</span>
                <p><span className="text-white font-bold">콤보 시스템 활용:</span> 연속으로 정답을 맞히면 콤보 점수가 기하급수적으로 올라가 높은 점수를 얻을 수 있습니다.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">4</span>
                <p><span className="text-white font-bold">돋보기 기능 활용:</span> 이미지를 클릭하여 확대하면 AI 특유의 부자연스러운 디테일을 더 잘 확인할 수 있습니다.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">5</span>
                <p><span className="text-white font-bold">리뷰 및 학습:</span> 매 라운드 종료 후 제공되는 '판별 단서'를 통해 AI 그림의 특징을 학습해 보세요.</p>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="bg-blue-500/20 px-2 py-0.5 rounded text-sm uppercase tracking-tighter">Features</span>
              주요 특징
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="text-white font-bold mb-1">✨ 실시간 AI 생성</div>
                <p className="text-slate-400 text-xs">고정된 이미지가 아닌, 매 게임마다 Gemini AI가 즉석에서 새로운 작품을 그립니다.</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="text-white font-bold mb-1">🔍 정밀 확대 모달</div>
                <p className="text-slate-400 text-xs">최고 화질의 이미지를 꽉 찬 화면으로 확대하여 미세한 질감 차이까지 분석 가능합니다.</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="text-white font-bold mb-1">🔥 콤보 점수 체계</div>
                <p className="text-slate-400 text-xs">단순 정답을 넘어, 연속 성공을 통한 긴장감 넘치는 랭킹 도전을 즐길 수 있습니다.</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="text-white font-bold mb-1">🎓 AI 교육적 가치</div>
                <p className="text-slate-400 text-xs">전문적인 판별 가이드를 통해 생성형 AI의 한계와 특징을 자연스럽게 이해하게 됩니다.</p>
              </div>
            </div>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-100 transition-colors shadow-lg text-lg"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="w-full py-4 px-6 bg-slate-900 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 relative z-20">
    <div className="flex flex-col items-center md:items-start">
      <div className="text-slate-400 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Created by</div>
      <div className="text-white font-black text-lg tracking-tighter leading-none">AKLABS <span className="text-purple-500 text-xs">AI STUDIO</span></div>
    </div>
    
    <a 
      href="https://litt.ly/aklabs" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex items-center gap-3 bg-white hover:bg-purple-600 px-6 py-2 rounded-xl transition-all duration-500 shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 flex flex-col items-start leading-tight">
        <span className="text-slate-900 group-hover:text-white text-xs font-bold transition-colors">AI 웹앱 제작이 궁금하다면?</span>
        <span className="text-purple-600 group-hover:text-purple-200 text-[10px] transition-colors">아크랩스에서 마스터가 되어보세요</span>
      </div>
      <div className="relative z-10 bg-slate-900 text-white p-1.5 rounded-lg group-hover:bg-white group-hover:text-purple-600 transition-all duration-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </a>
  </footer>
);

const ApiKeyModal: React.FC<{
  isOpen: boolean;
  apiKey: string;
  onClose: () => void;
  onApiKeyChange: (nextKey: string) => void;
}> = ({ isOpen, apiKey, onClose, onApiKeyChange }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2rem] p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black text-white mb-3">Gemini API Key</h2>
        <p className="text-slate-400 text-sm mb-6">
          키는 로컬 저장소에만 저장되며, 이미지 생성 요청에만 사용됩니다.
        </p>
        <input
          type="password"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="AIza... (로컬 저장)"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          className="w-full rounded-xl border-2 border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
        />
        <div className="text-[11px] text-slate-400 mt-3">
          {apiKey.trim().length > 0 ? '로컬 저장됨' : '입력된 키가 없습니다.'}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-white text-slate-900 font-black py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg text-base"
        >
          저장 완료
        </button>
      </div>
    </div>
  );
};

const StartScreen: React.FC<{
  onStart: (mode: ModelMode, difficulty: Difficulty) => void;
  apiKey: string;
  onApiKeyChange: (nextKey: string) => void;
}> = ({ onStart, apiKey, onApiKeyChange }) => {
  const [selectedMode, setSelectedMode] = useState<ModelMode>('eco');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  const handleStartClick = async () => {
    const hasLocalKey = apiKey.trim().length > 0;
    if (!hasLocalKey) {
      try {
        // @ts-ignore
        if (window.aistudio?.hasSelectedApiKey) {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
          }
        } else {
          alert("Gemini API 키를 입력해주세요.");
          return;
        }
      } catch (e) {
        console.error("API Key check failed", e);
        alert("API 키를 확인할 수 없습니다. 다시 시도해주세요.");
        return;
      }
    }
    onStart(selectedMode, difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center p-6 md:p-8 relative">
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        apiKey={apiKey}
        onClose={() => setIsApiKeyOpen(false)}
        onApiKeyChange={onApiKeyChange}
      />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={() => setIsApiKeyOpen(true)}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-2 rounded-full text-slate-300 hover:text-white transition-all border border-white/5 text-xs font-bold"
        >
          API Key
          <span className={`text-[10px] ${apiKey.trim().length > 0 ? 'text-emerald-300' : 'text-slate-400'}`}>
            {apiKey.trim().length > 0 ? 'Saved' : 'Empty'}
          </span>
        </button>
        <button 
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-4 py-2 rounded-full text-slate-300 hover:text-white transition-all border border-white/5 text-sm font-bold"
        >
          <HelpCircle className="w-4 h-4" />
          가이드 & 특징
        </button>
      </div>

      <div className="mb-4 bg-purple-500/10 p-5 rounded-3xl animate-pulse ring-1 ring-purple-500/30">
        <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.283a2 2 0 01-1.186.13l-2.045-.451a2 2 0 01-1.247-1.14l-.502-1.392a2 2 0 01.543-2.101l1.523-1.27a2 2 0 00.52-2.224l-.428-.958a2 2 0 01.65-2.269l.99-.706a2 2 0 012.29.126l.91.683a2 2 0 002.277.223l.919-.46a2 2 0 012.26.181l.853.708a2 2 0 01.656 2.24l-.432.958a2 2 0 00.51 2.235l1.435 1.2a2 2 0 01.554 2.115l-.485 1.366a2 2 0 01-1.246 1.146l-1.82.405a2 2 0 00-1.104.535l-2.058 2.058a2 2 0 01-2.828 0l-2.058-2.058z" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-none">
        AI <span className="text-purple-500">vs</span> Human Art
      </h1>
      <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl font-medium">
        당신의 눈을 믿을 수 있나요? <br/>
        <span className="text-purple-400">Gemini</span>가 생성한 가짜와 진짜 예술을 구분해보세요.
      </p>

      <div className="w-full max-w-xl space-y-6 mb-8">
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">1. 모델 성능 선택</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => setSelectedMode('eco')} className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedMode === 'eco' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
              <div className="font-bold text-base mb-1">가성비형 (Eco)</div>
              <p className="text-slate-400 text-[10px]">빠른 속도와 넓은 무료 한도</p>
            </button>
            <button onClick={() => setSelectedMode('pro')} className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedMode === 'pro' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
              <div className="font-bold text-base mb-1">고성능형 (Pro)</div>
              <p className="text-slate-400 text-[10px]">극사실적 고해상도 이미지</p>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">2. 난이도 설정</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-6 py-2 rounded-full font-bold capitalize transition-all duration-300 border-2 text-sm ${
                  difficulty === d 
                    ? 'bg-white text-slate-900 border-white scale-105' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {d === 'easy' ? '쉬움' : d === 'normal' ? '보통' : '어려움'}
              </button>
            ))}
          </div>
        </section>
      </div>

      <button
        onClick={handleStartClick}
        className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
      >
        <span className="relative z-10">퀴즈 생성하기</span>
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Start);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [apiKey, setApiKey] = useState(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    return stored ?? process.env.API_KEY ?? '';
  });

  const persistApiKey = useCallback((nextKey: string) => {
    const trimmedKey = nextKey.trim();
    if (trimmedKey.length > 0) {
      localStorage.setItem(API_KEY_STORAGE, trimmedKey);
      setApiKey(trimmedKey);
      return;
    }
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
  }, []);

  const generateImage = async (
    prompt: string,
    mode: ModelMode,
    difficulty: Difficulty,
    isAi: boolean,
    keyOverride: string
  ): Promise<string> => {
    const resolvedApiKey = keyOverride.trim() || process.env.API_KEY || '';
    if (!resolvedApiKey) {
      throw new Error('Gemini API 키가 필요합니다.');
    }

    const ai = new GoogleGenAI({ apiKey: resolvedApiKey });
    
    let finalPrompt = prompt;
    if (isAi) {
      if (difficulty === 'easy') {
        finalPrompt += ", clearly AI generated art, synthetic look, digital textures, plastic appearance, uncanny perfection";
      } else if (difficulty === 'hard') {
        finalPrompt += ", masterfully deceptive, extreme photo-realism, natural camera imperfections, realistic human skin textures, subtle noise, looks like a real award-winning photograph";
      }
    } else {
      if (difficulty === 'easy') {
        finalPrompt += ", rough amateur sketch, low quality mobile photo, messy edges, basic drawing style";
      } else if (difficulty === 'hard') {
        finalPrompt += ", legendary master artist style, intricate detail, perfect hand-made quality, museum quality, professional high-end execution";
      }
    }

    const config: any = { 
      imageConfig: { aspectRatio: "1:1" }
    };

    if (mode === 'pro') {
      config.imageConfig.imageSize = "1K";
      config.tools = [{googleSearch: {}}];
    }

    try {
      const response = await ai.models.generateContent({
        model: mode === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
        contents: { parts: [{ text: finalPrompt }] },
        config,
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error(`API Response Error: No candidates or parts found.`);
      }

      let aiTextResponse = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
        if (part.text) {
          aiTextResponse += part.text;
        }
      }

      throw new Error(`AI generated text instead of an image: "${aiTextResponse.substring(0, 100)}..."`);
    } catch (e: any) {
      console.error("Image generation error:", e);
      throw e;
    }
  };

  const startGame = useCallback(async (mode: ModelMode, difficulty: Difficulty) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    initAudio();

    try {
      const newQuestions: Question[] = [];
      
      for (let i = 0; i < QUIZ_TEMPLATES.length; i++) {
        const template = QUIZ_TEMPLATES[i];
        
        try {
          const [img1, img2] = await Promise.all([
            generateImage(
              template.correctAnswer === 'A' ? template.aiPrompt : template.humanPrompt,
              mode,
              difficulty,
              template.correctAnswer === 'A',
              apiKey
            ),
            generateImage(
              template.correctAnswer === 'B' ? template.aiPrompt : template.humanPrompt,
              mode,
              difficulty,
              template.correctAnswer === 'B',
              apiKey
            )
          ]);

          newQuestions.push({
            id: template.id,
            style: template.style,
            images: [
              { id: 'A', type: template.correctAnswer === 'A' ? 'ai' : 'human', url: img1 },
              { id: 'B', type: template.correctAnswer === 'B' ? 'ai' : 'human', url: img2 }
            ],
            correctAnswer: template.correctAnswer,
            explanation: template.explanation
          });
        } catch (innerError: any) {
          const msg = innerError.message || "";
          if (msg.includes("429") || msg.includes("403") || msg.includes("404") || msg.includes("permission") || msg.includes("not found")) {
             alert("API 권한이 없거나 한도에 도달했습니다. 개인 API 키를 선택해 주세요.");
             // @ts-ignore
             await window.aistudio.openSelectKey();
             i--;
             continue; 
          }
          throw innerError;
        }

        setGenerationProgress(((i + 1) / QUIZ_TEMPLATES.length) * 100);
      }

      setQuestions(newQuestions);
      setAnswers([]);
      setFinalScore(0);
      setIsGenerating(false);
      setGameStatus(GameStatus.Playing);
    } catch (error: any) {
      console.error("Quiz Start Failed:", error);
      setIsGenerating(false);
      alert(`이미지 생성에 실패했습니다. (원인: ${error.message})`);
    }
  }, [apiKey]);

  const handleGameFinish = useCallback((score: number, finalAnswers: Answer[]) => {
    setFinalScore(score);
    setAnswers(finalAnswers);
    setGameStatus(GameStatus.Finished);
    playResultSound(score);
  }, []);

  const handleRestart = useCallback(() => {
    setGameStatus(GameStatus.Start);
  }, []);

  return (
    <main className="bg-slate-950 min-h-screen text-white flex flex-col items-center justify-center font-sans p-2 sm:p-4">
      <div className="w-full max-w-7xl mx-auto h-[94vh] max-h-[1000px] bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"></div>
        <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar flex flex-col scroll-smooth">
          {isGenerating ? (
            <LoadingScreen progress={generationProgress} />
          ) : gameStatus === GameStatus.Start ? (
            <StartScreen onStart={startGame} apiKey={apiKey} onApiKeyChange={persistApiKey} />
          ) : gameStatus === GameStatus.Playing ? (
            <GameScreen questions={questions} onFinish={handleGameFinish} />
          ) : (
            <ResultScreen score={finalScore} answers={answers} questions={questions} onRestart={handleRestart} />
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default App;
