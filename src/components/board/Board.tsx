import React from 'react';
import styles from './GameGrid.module.scss';

const Board:React.FC<GameGridProps> = ({ grid, onCellClick, disabled = false }) => {
    return (
      <div className={styles.grid}>
        {grid.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${styles[cell.state]}`}
                onClick={() => !disabled && onCellClick?.(x, y)}
              />
            ))}
          </div>
        ))}
      </div>
    )
}

export default Board;



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

