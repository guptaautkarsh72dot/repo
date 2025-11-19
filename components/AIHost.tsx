import React from 'react';
import { Bot, Sparkles, Brain, Smile, Frown } from 'lucide-react';
import { AIState } from '../types';

interface AIHostProps {
  aiState: AIState;
}

export const AIHost: React.FC<AIHostProps> = ({ aiState }) => {
  const getIcon = () => {
    if (aiState.isThinking) return <Brain className="w-12 h-12 text-indigo-400 animate-pulse" />;
    
    switch (aiState.emotion) {
      case 'happy': return <Sparkles className="w-12 h-12 text-yellow-400" />;
      case 'sarcastic': return <Bot className="w-12 h-12 text-pink-400" />;
      case 'surprised': return <Bot className="w-12 h-12 text-orange-400" />;
      case 'thinking': return <Brain className="w-12 h-12 text-blue-400" />;
      default: return <Bot className="w-12 h-12 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto mt-8 p-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-xl relative z-10">
          {getIcon()}
        </div>
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className={`bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-lg transition-all duration-300 w-full relative ${aiState.isThinking ? 'opacity-70' : 'opacity-100'}`}>
         <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-800 border-t border-l border-slate-700 transform rotate-45"></div>
         <p className="text-slate-200 text-center text-lg font-medium leading-relaxed min-h-[3rem] flex items-center justify-center">
           {aiState.isThinking ? "Analyzing probabilities..." : aiState.message}
         </p>
      </div>
    </div>
  );
};
