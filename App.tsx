import React, { useState, useEffect, useCallback } from 'react';
import { GameControls } from './components/GameControls';
import { HistoryList } from './components/HistoryList';
import { AIHost } from './components/AIHost';
import { 
  Difficulty, 
  DIFFICULTY_CONFIG, 
  GuessRecord, 
  GuessStatus, 
  AIState 
} from './types';
import { generateGameCommentary, generateHint } from './services/geminiService';
import { Trophy, Target, Hash, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  
  const [aiState, setAiState] = useState<AIState>({
    message: "Welcome! Pick a difficulty and start guessing.",
    isThinking: false,
    emotion: 'neutral'
  });

  // Initialize game
  const startNewGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const newTarget = Math.floor(Math.random() * config.max) + 1;
    setTargetNumber(newTarget);
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setAiState({
      message: `I'm thinking of a number between 1 and ${config.max}. Good luck!`,
      isThinking: false,
      emotion: 'happy'
    });
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle a new guess
  const handleGuess = async (val: number) => {
    if (gameOver) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    let status = GuessStatus.INVALID;

    if (val === targetNumber) {
      status = GuessStatus.CORRECT;
    } else if (val > targetNumber) {
      status = GuessStatus.TOO_HIGH;
    } else {
      status = GuessStatus.TOO_LOW;
    }

    const newGuess: GuessRecord = {
      value: val,
      status,
      timestamp: Date.now()
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    // Check Win/Loss
    if (status === GuessStatus.CORRECT) {
      setGameOver(true);
      setWon(true);
    } else if (newGuesses.length >= config.attempts) {
      setGameOver(true);
      setWon(false);
    }

    // Trigger AI Reaction
    setAiState(prev => ({ ...prev, isThinking: true }));
    
    // We pass the state *as if* it just happened
    const commentary = await generateGameCommentary(
      val, 
      targetNumber, 
      status, 
      newGuesses, 
      difficulty
    );

    // If lost, override message slightly if AI didn't catch it contextually
    if (newGuesses.length >= config.attempts && status !== GuessStatus.CORRECT) {
      commentary.text = `Game Over! The number was ${targetNumber}. ${commentary.text}`;
      commentary.emotion = 'sarcastic';
    }

    setAiState({
      message: commentary.text,
      isThinking: false,
      emotion: commentary.emotion as any
    });
  };

  const handleHint = async () => {
    if (gameOver) return;
    setAiState(prev => ({ ...prev, isThinking: true }));
    const hint = await generateHint(targetNumber, guesses);
    setAiState({
      message: `HINT: ${hint}`,
      isThinking: false,
      emotion: 'thinking'
    });
  };

  const config = DIFFICULTY_CONFIG[difficulty];
  const remainingAttempts = config.attempts - guesses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center p-4 sm:p-6">
      
      {/* Header / Difficulty Selector */}
      <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Gemini Guessmaster</h1>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                difficulty === diff 
                  ? 'bg-indigo-500 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center relative">
        
        {/* Game Info Cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Attempts</span>
            <div className={`text-2xl font-black ${remainingAttempts < 3 ? 'text-red-400' : 'text-white'}`}>
              {remainingAttempts}
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Range</span>
            <div className="text-2xl font-black text-white">
              1 - {config.max}
            </div>
          </div>
        </div>

        {/* Central Display */}
        <div className="relative mb-6">
          {won ? (
            <div className="animate-bounce">
              <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-2xl" />
            </div>
          ) : gameOver ? (
            <div className="animate-pulse">
               <AlertCircle className="w-32 h-32 text-red-400 drop-shadow-2xl" />
            </div>
          ) : (
             <Hash className="w-32 h-32 text-indigo-500/20 drop-shadow-2xl" />
          )}
          
          {/* Victory/Defeat Overlay Text */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-white drop-shadow-lg stroke-black stroke-2">
                {targetNumber}
              </span>
            </div>
          )}
        </div>

        <GameControls 
          onGuess={handleGuess} 
          onHint={handleHint}
          onReset={startNewGame}
          gameOver={gameOver}
          max={config.max}
          disabled={aiState.isThinking}
        />

        <HistoryList guesses={guesses} />

        <AIHost aiState={aiState} />

      </main>
      
      <footer className="mt-auto pt-8 text-center text-slate-600 text-sm">
        Powered by Google Gemini API • React • Tailwind
      </footer>
    </div>
  );
};

export default App;
