import React, {useState} from "react";
import "./DroppableCell.scss";
import {useDrop} from "react-dnd";
import {CellProps} from "../../../models/game/CellProps";

const DroppableCell: React.FC<CellProps> = ({x, y, state, onDrop, disabled }) => {

  const [droppedItem, setDroppedItem] = useState<{orientation?: string} | null>(null);

  const [{isOver}, dropRef] = useDrop(() => ({

    accept: `BOAT`, //La clé du useDrag
    drop: (item: { id: string, size: number, orientation: string }) => {
      if (!disabled) {
        onDrop(x, y, item) //appel onDrop avec l'item et la position en paramètre | la callback parentale avec les coordonnées et l'item draggé
        setDroppedItem(item)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), //si un objet est au dessus de cette cellule
    }),

  }));

  return (<div
    ref={dropRef as unknown as React.Ref<HTMLDivElement>}
    className={`cell ${state} ${isOver ? "hover" : ""}`}
  />)

}

export default DroppableCell;

