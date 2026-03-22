import { Board, Piece, PieceColor, Position, Move } from '../types/chess';

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRow: ('rook' | 'knight' | 'bishop' | 'queen' | 'king')[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' };
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
    board[7][col] = { type: backRow[col], color: 'white' };
  }

  return board;
};

export const copyBoard = (board: Board): Board => {
  return board.map(row => row.map(piece => piece ? { ...piece } : null));
};

export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const getPieceAt = (board: Board, pos: Position): Piece | null => {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
};

export const getValidMoves = (board: Board, pos: Position, checkForCheck = true): Position[] => {
  const piece = getPieceAt(board, pos);
  if (!piece) return [];

  let moves: Position[] = [];

  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(board, pos, piece.color);
      break;
    case 'rook':
      moves = getRookMoves(board, pos, piece.color);
      break;
    case 'knight':
      moves = getKnightMoves(board, pos, piece.color);
      break;
    case 'bishop':
      moves = getBishopMoves(board, pos, piece.color);
      break;
    case 'queen':
      moves = getQueenMoves(board, pos, piece.color);
      break;
    case 'king':
      moves = getKingMoves(board, pos, piece.color);
      break;
  }

  if (checkForCheck) {
    moves = moves.filter(move => !wouldBeInCheck(board, pos, move, piece.color));
  }

  return moves;
};

const getPawnMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  const forward = { row: pos.row + direction, col: pos.col };
  if (isValidPosition(forward) && !getPieceAt(board, forward)) {
    moves.push(forward);

    if (pos.row === startRow) {
      const doubleForward = { row: pos.row + 2 * direction, col: pos.col };
      if (!getPieceAt(board, doubleForward)) {
        moves.push(doubleForward);
      }
    }
  }

  const captures = [
    { row: pos.row + direction, col: pos.col - 1 },
    { row: pos.row + direction, col: pos.col + 1 }
  ];

  for (const capture of captures) {
    if (isValidPosition(capture)) {
      const targetPiece = getPieceAt(board, capture);
      if (targetPiece && targetPiece.color !== color) {
        moves.push(capture);
      }
    }
  }

  return moves;
};

const getRookMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  return getSlidingMoves(board, pos, color, [
    { row: 0, col: 1 }, { row: 0, col: -1 },
    { row: 1, col: 0 }, { row: -1, col: 0 }
  ]);
};

const getBishopMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  return getSlidingMoves(board, pos, color, [
    { row: 1, col: 1 }, { row: 1, col: -1 },
    { row: -1, col: 1 }, { row: -1, col: -1 }
  ]);
};

const getQueenMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  return getSlidingMoves(board, pos, color, [
    { row: 0, col: 1 }, { row: 0, col: -1 },
    { row: 1, col: 0 }, { row: -1, col: 0 },
    { row: 1, col: 1 }, { row: 1, col: -1 },
    { row: -1, col: 1 }, { row: -1, col: -1 }
  ]);
};

const getSlidingMoves = (board: Board, pos: Position, color: PieceColor, directions: Position[]): Position[] => {
  const moves: Position[] = [];

  for (const dir of directions) {
    let current = { row: pos.row + dir.row, col: pos.col + dir.col };

    while (isValidPosition(current)) {
      const piece = getPieceAt(board, current);

      if (!piece) {
        moves.push({ ...current });
      } else {
        if (piece.color !== color) {
          moves.push({ ...current });
        }
        break;
      }

      current = { row: current.row + dir.row, col: current.col + dir.col };
    }
  }

  return moves;
};

const getKnightMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];

  for (const offset of offsets) {
    const target = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (isValidPosition(target)) {
      const piece = getPieceAt(board, target);
      if (!piece || piece.color !== color) {
        moves.push(target);
      }
    }
  }

  return moves;
};

const getKingMoves = (board: Board, pos: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];

  for (const offset of offsets) {
    const target = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (isValidPosition(target)) {
      const piece = getPieceAt(board, target);
      if (!piece || piece.color !== color) {
        moves.push(target);
      }
    }
  }

  return moves;
};

export const findKingPosition = (board: Board, color: PieceColor): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isSquareUnderAttack = (board: Board, pos: Position, attackerColor: PieceColor): boolean => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === attackerColor) {
        const moves = getValidMoves(board, { row, col }, false);
        if (moves.some(move => move.row === pos.row && move.col === pos.col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKingPosition(board, color);
  if (!kingPos) return false;

  const opponentColor: PieceColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(board, kingPos, opponentColor);
};

const wouldBeInCheck = (board: Board, from: Position, to: Position, color: PieceColor): boolean => {
  const testBoard = copyBoard(board);
  testBoard[to.row][to.col] = testBoard[from.row][from.col];
  testBoard[from.row][from.col] = null;
  return isInCheck(testBoard, color);
};

export const isCheckmate = (board: Board, color: PieceColor): boolean => {
  if (!isInCheck(board, color)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col });
        if (moves.length > 0) return false;
      }
    }
  }

  return true;
};

export const isStalemate = (board: Board, color: PieceColor): boolean => {
  if (isInCheck(board, color)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col });
        if (moves.length > 0) return false;
      }
    }
  }

  return true;
};

export const makeMove = (board: Board, from: Position, to: Position): Board => {
  const newBoard = copyBoard(board);
  const piece = newBoard[from.row][from.col];

  if (piece) {
    piece.hasMoved = true;
  }

  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  if (piece && piece.type === 'pawn') {
    if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
      newBoard[to.row][to.col] = { type: 'queen', color: piece.color, hasMoved: true };
    }
  }

  return newBoard;
};

export const getAllValidMoves = (board: Board, color: PieceColor): Move[] => {
  const moves: Move[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const validMoves = getValidMoves(board, from);
        for (const to of validMoves) {
          moves.push({ from, to });
        }
      }
    }
  }

  return moves;
};
