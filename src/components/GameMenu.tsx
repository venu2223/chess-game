import { Difficulty } from '../types/chess';
import { Crown, Users, Cpu } from 'lucide-react';

interface GameMenuProps {
  onStart2Player: () => void;
  onStartVsComputer: (difficulty: Difficulty) => void;
}

export default function GameMenu({ onStart2Player, onStartVsComputer }: GameMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Crown className="w-20 h-20 mx-auto mb-4 text-amber-500 animate-pulse" />
          <h1 className="text-6xl font-bold text-white mb-2">Chess Master</h1>
          <p className="text-xl text-gray-400">Choose your game mode</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={onStart2Player}
            className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-white group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-white mb-2">2 Players</h2>
            <p className="text-blue-100">Play against a friend locally</p>
          </button>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Cpu className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">VS Computer</h2>

            <div className="space-y-3">
              <button
                onClick={() => onStartVsComputer('easy')}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
              >
                Easy
              </button>
              <button
                onClick={() => onStartVsComputer('medium')}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50"
              >
                Medium
              </button>
              <button
                onClick={() => onStartVsComputer('hard')}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
              >
                Hard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Click on a piece to select it, then click on a highlighted square to move</p>
        </div>
      </div>
    </div>
  );
}
