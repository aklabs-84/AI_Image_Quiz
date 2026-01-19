
export interface ImageOptionData {
  id: 'A' | 'B';
  type: 'ai' | 'human';
  url: string;
}

export interface Question {
  id: number;
  style: string;
  images: [ImageOptionData, ImageOptionData];
  correctAnswer: 'A' | 'B';
  explanation: string;
}

export interface Answer {
  questionId: number;
  userAnswer: 'A' | 'B';
  isCorrect: boolean;
}

export enum GameStatus {
  Start,
  Playing,
  Finished,
}

export type Difficulty = 'easy' | 'normal' | 'hard';
