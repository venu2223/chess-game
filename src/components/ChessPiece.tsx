import { Piece } from '../types/chess';

interface ChessPieceProps {
  piece: Piece;
}

const pieceSymbols: Record<string, Record<string, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export default function ChessPiece({ piece }: ChessPieceProps) {
  return (
    <div className="text-5xl select-none pointer-events-none transition-transform duration-200">
      {pieceSymbols[piece.color][piece.type]}
    </div>
  );
}
