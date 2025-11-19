import React from 'react';
import { GuessRecord, GuessStatus } from '../types';
import { ArrowDown, ArrowUp, CheckCircle } from 'lucide-react';

interface HistoryListProps {
  guesses: GuessRecord[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ guesses }) => {
  if (guesses.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 text-center">
        History
      </h3>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-hide px-2">
        {guesses.slice().reverse().map((guess, idx) => (
          <div 
            key={guess.timestamp}
            className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 animate-in slide-in-from-top-2 fade-in duration-300"
          >
            <span className="text-slate-400 font-mono text-sm">#{guesses.length - idx}</span>
            <span className="text-white font-bold text-lg">{guess.value}</span>
            <div className="flex items-center gap-2">
              {guess.status === GuessStatus.TOO_HIGH && (
                <>
                  <span className="text-orange-400 text-sm font-medium">Too High</span>
                  <ArrowDown className="w-4 h-4 text-orange-400" />
                </>
              )}
              {guess.status === GuessStatus.TOO_LOW && (
                <>
                  <span className="text-blue-400 text-sm font-medium">Too Low</span>
                  <ArrowUp className="w-4 h-4 text-blue-400" />
                </>
              )}
              {guess.status === GuessStatus.CORRECT && (
                <>
                  <span className="text-green-400 text-sm font-medium">Correct</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
