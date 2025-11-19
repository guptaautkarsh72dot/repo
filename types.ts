export enum Difficulty {
  EASY = 'EASY',     // 1-50
  MEDIUM = 'MEDIUM', // 1-100
  HARD = 'HARD',     // 1-500
  INSANE = 'INSANE'  // 1-1000
}

export interface GameConfig {
  max: number;
  attempts: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  [Difficulty.EASY]: { max: 50, attempts: 10 },
  [Difficulty.MEDIUM]: { max: 100, attempts: 10 },
  [Difficulty.HARD]: { max: 500, attempts: 15 },
  [Difficulty.INSANE]: { max: 1000, attempts: 20 },
};

export enum GuessStatus {
  TOO_LOW = 'TOO_LOW',
  TOO_HIGH = 'TOO_HIGH',
  CORRECT = 'CORRECT',
  INVALID = 'INVALID'
}

export interface GuessRecord {
  value: number;
  status: GuessStatus;
  timestamp: number;
}

export interface AIState {
  message: string;
  isThinking: boolean;
  emotion: 'neutral' | 'happy' | 'sarcastic' | 'surprised' | 'thinking';
}
