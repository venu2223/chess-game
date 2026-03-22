import { PieceColor, GameMode, Difficulty } from '../types/chess';
import { RotateCcw, Home, AlertCircle, Trophy, CircleDot } from 'lucide-react';

interface GameStatusProps {
  currentPlayer: PieceColor;
  gameOver: boolean;
  winner: PieceColor | 'draw' | null;
  check: boolean;
  gameMode: GameMode;
  difficulty?: Difficulty;
  onReset: () => void;
  onBackToMenu: () => void;
}

export default function GameStatus({
  currentPlayer,
  gameOver,
  winner,
  check,
  gameMode,
  difficulty,
  onReset,
  onBackToMenu
}: GameStatusProps) {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Game Info</h2>

        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">Mode</p>
          <p className="text-lg font-semibold text-white">
            {gameMode === '2player' ? '2 Players' : `VS Computer (${difficulty})`}
          </p>
        </div>

        {!gameOver && (
          <div className="bg-slate-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CircleDot className={`w-5 h-5 ${currentPlayer === 'white' ? 'text-white' : 'text-gray-800'}`} />
              <p className="text-lg font-semibold text-white">
                {currentPlayer === 'white' ? 'White' : 'Black'} to move
              </p>
            </div>
            {check && (
              <div className="flex items-center justify-center gap-2 text-red-400 mt-2">
                <AlertCircle className="w-5 h-5" />
                <p className="font-bold">CHECK!</p>
              </div>
            )}
          </div>
        )}

        {gameOver && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-6 space-y-2 animate-pulse">
            <Trophy className="w-12 h-12 mx-auto text-white" />
            <p className="text-2xl font-bold text-white">
              {winner === 'draw' ? "It's a Draw!" : `${winner === 'white' ? 'White' : 'Black'} Wins!`}
            </p>
            {winner !== 'draw' && <p className="text-amber-100">Checkmate!</p>}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </button>

        <button
          onClick={onBackToMenu}
          className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          <Home className="w-5 h-5" />
          Main Menu
        </button>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">How to Play</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>Click a piece to select it</li>
          <li>Green dots show valid moves</li>
          <li>Click a green dot to move</li>
          <li>Capture the opponent's king to win</li>
        </ul>
      </div>
    </div>
  );
}
