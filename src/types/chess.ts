export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type GameMode = 'menu' | '2player' | 'vsComputer';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotedTo?: PieceType;
}

export type Board = (Piece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  selectedPiece: Position | null;
  validMoves: Position[];
  gameOver: boolean;
  winner: PieceColor | 'draw' | null;
  check: boolean;
  moveHistory: Move[];
}
