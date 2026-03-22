import { useState, useEffect } from 'react';
import { GameMode, Difficulty, Position, PieceColor } from './types/chess';
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  isCheckmate,
  isStalemate,
  isInCheck,
  getPieceAt
} from './utils/chessLogic';
import { getComputerMove } from './utils/chessAI';
import GameMenu from './components/GameMenu';
import ChessBoard from './components/ChessBoard';
import GameStatus from './components/GameStatus';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<PieceColor | 'draw' | null>(null);
  const [check, setCheck] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  useEffect(() => {
    if (gameMode === 'vsComputer' && currentPlayer === 'black' && !gameOver && !isComputerThinking) {
      setIsComputerThinking(true);
      setTimeout(() => {
        const move = getComputerMove(board, 'black', difficulty);
        if (move) {
          handleComputerMove(move.from, move.to);
        }
        setIsComputerThinking(false);
      }, 500);
    }
  }, [currentPlayer, gameMode, gameOver, board, difficulty, isComputerThinking]);

  const handleComputerMove = (from: Position, to: Position) => {
    const newBoard = makeMove(board, from, to);
    setBoard(newBoard);
    setCurrentPlayer('white');
    checkGameStatus(newBoard, 'white');
  };

  const checkGameStatus = (currentBoard = board, player: PieceColor) => {
    if (isCheckmate(currentBoard, player)) {
      setGameOver(true);
      setWinner(player === 'white' ? 'black' : 'white');
      setCheck(false);
    } else if (isStalemate(currentBoard, player)) {
      setGameOver(true);
      setWinner('draw');
      setCheck(false);
    } else if (isInCheck(currentBoard, player)) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };

  const handleSquareClick = (pos: Position) => {
    if (gameOver || isComputerThinking) return;

    if (gameMode === 'vsComputer' && currentPlayer === 'black') return;

    const piece = getPieceAt(board, pos);

    if (selectedPiece) {
      const isValidMove = validMoves.some(move => move.row === pos.row && move.col === pos.col);

      if (isValidMove) {
        const newBoard = makeMove(board, selectedPiece, pos);
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);

        const nextPlayer: PieceColor = currentPlayer === 'white' ? 'black' : 'white';
        setCurrentPlayer(nextPlayer);
        checkGameStatus(newBoard, nextPlayer);
      } else if (piece && piece.color === currentPlayer) {
        setSelectedPiece(pos);
        setValidMoves(getValidMoves(board, pos));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else {
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece(pos);
        setValidMoves(getValidMoves(board, pos));
      }
    }
  };

  const handleStart2Player = () => {
    resetGame();
    setGameMode('2player');
  };

  const handleStartVsComputer = (diff: Difficulty) => {
    resetGame();
    setDifficulty(diff);
    setGameMode('vsComputer');
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setCheck(false);
    setIsComputerThinking(false);
  };

  const handleBackToMenu = () => {
    resetGame();
    setGameMode('menu');
  };

  if (gameMode === 'menu') {
    return <GameMenu onStart2Player={handleStart2Player} onStartVsComputer={handleStartVsComputer} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-7xl w-full">
        <div className="order-2 lg:order-1">
          <GameStatus
            currentPlayer={currentPlayer}
            gameOver={gameOver}
            winner={winner}
            check={check}
            gameMode={gameMode}
            difficulty={difficulty}
            onReset={resetGame}
            onBackToMenu={handleBackToMenu}
          />
        </div>

        <div className="order-1 lg:order-2">
          <ChessBoard
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            flipped={gameMode === 'vsComputer'}
          />
        </div>
      </div>

      {isComputerThinking && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Computer is thinking...</span>
        </div>
      )}
    </div>
  );
}

export default App;
