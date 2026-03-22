import { Board, Position } from '../types/chess';
import ChessPiece from './ChessPiece';
import { getPieceAt } from '../utils/chessLogic';

interface ChessBoardProps {
  board: Board;
  selectedPiece: Position | null;
  validMoves: Position[];
  onSquareClick: (pos: Position) => void;
  flipped?: boolean;
}

export default function ChessBoard({ board, selectedPiece, validMoves, onSquareClick, flipped = false }: ChessBoardProps) {
  const isSelected = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col;
  };

  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const renderSquare = (row: number, col: number) => {
    const displayRow = flipped ? 7 - row : row;
    const displayCol = flipped ? 7 - col : col;
    const piece = getPieceAt(board, { row: displayRow, col: displayCol });
    const isLight = (row + col) % 2 === 0;
    const selected = isSelected(displayRow, displayCol);
    const validMove = isValidMove(displayRow, displayCol);

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => onSquareClick({ row: displayRow, col: displayCol })}
        className={`
          aspect-square flex items-center justify-center cursor-pointer relative
          transition-all duration-200 hover:brightness-95
          ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
          ${selected ? 'ring-4 ring-blue-500 ring-inset' : ''}
        `}
      >
        {piece && <ChessPiece piece={piece} />}
        {validMove && (
          <div className={`
            absolute w-4 h-4 rounded-full pointer-events-none
            ${piece ? 'w-full h-full border-4 border-green-500 opacity-60' : 'bg-green-500 opacity-60'}
          `} />
        )}
        {row === 7 && (
          <span className={`absolute bottom-1 right-1 text-xs font-semibold ${isLight ? 'text-amber-700' : 'text-amber-100'}`}>
            {String.fromCharCode(97 + col)}
          </span>
        )}
        {col === 0 && (
          <span className={`absolute top-1 left-1 text-xs font-semibold ${isLight ? 'text-amber-700' : 'text-amber-100'}`}>
            {8 - row}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-2xl">
      <div className="grid grid-cols-8 gap-0 w-full max-w-2xl aspect-square border-4 border-gray-900 rounded-lg overflow-hidden">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
        )}
      </div>
    </div>
  );
}
