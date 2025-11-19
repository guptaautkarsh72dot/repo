import React, { useState } from 'react';
import { Send, HelpCircle, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onGuess: (val: number) => void;
  onHint: () => void;
  onReset: () => void;
  gameOver: boolean;
  max: number;
  disabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  onGuess, 
  onHint, 
  onReset, 
  gameOver, 
  max,
  disabled 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) {
      onGuess(num);
      setInputValue('');
    }
  };

  if (gameOver) {
    return (
      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
        >
          <RotateCcw className="w-6 h-6" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-md mx-auto">
      <div className="relative group">
        <input
          type="number"
          min={1}
          max={max}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          placeholder={`1 - ${max}`}
          className="w-full bg-slate-800/50 border-2 border-slate-700 text-white text-center text-3xl py-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button
          type="button"
          onClick={onHint}
          disabled={disabled}
          className="col-span-1 flex items-center justify-center bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 border border-indigo-800/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Ask AI for a hint"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        <button
          type="submit"
          disabled={!inputValue || disabled}
          className="col-span-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Send className="w-5 h-5" />
          GUESS
        </button>
      </div>
    </form>
  );
};
