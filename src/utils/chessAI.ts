import { Board, Move, PieceColor, Difficulty, Piece } from '../types/chess';
import { getAllValidMoves, makeMove, isCheckmate, getPieceAt } from './chessLogic';

const pieceValues: Record<string, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900
};

const evaluateBoard = (board: Board, color: PieceColor): number => {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        const positionBonus = getPositionBonus(piece, row, col);

        if (piece.color === color) {
          score += value + positionBonus;
        } else {
          score -= value + positionBonus;
        }
      }
    }
  }

  return score;
};

const getPositionBonus = (piece: Piece, row: number, col: number): number => {
  const centerBonus = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 3, 2, 1, 0],
    [0, 1, 2, 3, 3, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  if (piece.type === 'knight' || piece.type === 'bishop') {
    return centerBonus[row][col];
  }

  if (piece.type === 'pawn') {
    return piece.color === 'white' ? (7 - row) : row;
  }

  return 0;
};

const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  color: PieceColor
): number => {
  const opponent: PieceColor = color === 'white' ? 'black' : 'white';

  if (depth === 0) {
    return evaluateBoard(board, color);
  }

  if (isCheckmate(board, maximizingPlayer ? color : opponent)) {
    return maximizingPlayer ? -10000 : 10000;
  }

  const moves = getAllValidMoves(board, maximizingPlayer ? color : opponent);

  if (moves.length === 0) {
    return 0;
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;

    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);

      if (beta <= alpha) break;
    }

    return maxEval;
  } else {
    let minEval = Infinity;

    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);

      if (beta <= alpha) break;
    }

    return minEval;
  }
};

const getRandomMove = (board: Board, color: PieceColor): Move | null => {
  const moves = getAllValidMoves(board, color);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
};

const getGreedyMove = (board: Board, color: PieceColor): Move | null => {
  const moves = getAllValidMoves(board, color);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    let score = evaluateBoard(newBoard, color);

    const capturedPiece = getPieceAt(board, move.to);
    if (capturedPiece) {
      score += pieceValues[capturedPiece.type] * 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

const getBestMove = (board: Board, color: PieceColor, depth: number): Move | null => {
  const moves = getAllValidMoves(board, color);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, color);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

export const getComputerMove = (board: Board, color: PieceColor, difficulty: Difficulty): Move | null => {
  switch (difficulty) {
    case 'easy':
      return getRandomMove(board, color);
    case 'medium':
      return getGreedyMove(board, color);
    case 'hard':
      return getBestMove(board, color, 3);
    default:
      return getRandomMove(board, color);
  }
};
