import React from 'react';
import "./Board.scss"
import DroppableCell from "./Cells/DroppableCell";
import {GameGridProps} from "../../models/game/GameGridProps";

/**
 * Integration de `useDrop`:
 *   - À chaque itération sur une cellule, on ajoute un hook `useDrop` pour la configurer comme une cible "droppable".
 *  - Les options importantes passées à `useDrop` :
 *         - `accept: "BOAT"` : Définit le type d'éléments qui peuvent être déposés ici.
 *                Cela correspond au même `type` utilisé dans `useDrag` (dans `DraggableBoat`).
 *         - `drop: (item: any)`: Callback appelée lorsque l'objet est déposé dans cette cellule.
 *                Ici, on utilise `onCellClick` pour transmettre les coordonnées et l'objet draggé à un parent.
 *         - `collect: (monitor)`: Permet de surveiller l'état en _live_,
 *                ici si un objet est au-dessus de la cellule (`isOver`).
 *                On pourrait utiliser cet état pour afficher un style visuel spécifique.
 */

const Board:React.FC<GameGridProps> = ({ grid, onCellClick, disabled = false }) => {
  return (
    <div className="grid">
      {grid.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell) => (
            <DroppableCell
              key={`${cell.x},${cell.y}`}
              x={cell.x}
              y={cell.y}
              state={cell.state}
              onDrop={onCellClick!}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board;

