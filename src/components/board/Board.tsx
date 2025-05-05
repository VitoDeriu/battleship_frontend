import React from 'react';
import "./Board.scss"

type Cell = {
  x: number;
  y: number;
  state: 'empty' | 'ship' | 'hit' | 'miss';
};

type GameGridProps = {
  grid: Cell[][];
  onCellClick?: (x: number, y: number) => void;
  disabled?: boolean;
};

const Board:React.FC<GameGridProps> = ({ grid, onCellClick, disabled = false }) => {
    return (
      <div className="grid">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`cell ${cell.state}`}
                onClick={() => !disabled && onCellClick?.(x, y)}
              />
            ))}
          </div>
        ))}
      </div>
    )
}

export default Board;

