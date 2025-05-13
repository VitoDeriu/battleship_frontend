import React from "react";
import "./DraggableBoat.scss";
import { useDrag } from "react-dnd";
import { Boat } from "../../../models/game/Boat";

type DraggableBoatProps = {
  boat: Boat;
  onRotate: () => void;
};

const DraggableBoat: React.FC<DraggableBoatProps> = ({ boat, onRotate }) => {

  const { id, name, size, orientation } = boat;

  /**
   * - useDrag:
   *     - Ce hook configure et active le comportement draggable pour le composant.
   *     - Utilise un type (`BOAT`) pour identifier cet objet comme un bateau dans l'écosystème global de drag-and-drop.
   *
   * - Structure de `useDrag` :
   *     - `type` : Le type de l'objet à draguer. Il sera comparé avec les targets compatibles (`useDrop`) pour valider où l'élément peut être déposé.
   *     - `item` : Les données associées à l'élément draggué (par exemple, son ID, sa taille et son orientation). Ce sont ces informations que le composant "droppable" (comme une grille) recevra plus tard.
   *     - `collect` : Une fonction utilisée pour surveiller l'état en temps réel du drag. Ici, elle collecte simplement si l'élément est en train d'être déplacé (`isDragging: true`).
   *
   * - `isDragging` : Une variable qui devient `true` lorsque l'objet est déplacé. Elle est utilisée pour modifier le visuel du composant (par exemple, réduction d'opacité pour indiquer qu'il est en cours de glisser).
   */
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOAT", //Le type de l'objet draggable (doit matcher avec les "drop targets")
    item: { id, size, name, orientation: boat.orientation }, // L'objet envoyé lorsque cet élément est "draggué".
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Permet de savoir si l'objet est en cours de drag
    }),
  }));

  console.log(`DraggableBoat - boat.orientation: ${boat.orientation}`);

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`boat ${orientation} ${isDragging ? "dragging" : ""} ${boat.position !== null ? "placed" : ""}`}
      style={{"--size": size} as React.CSSProperties}
    >
      <p>{name} ({size})</p>
      <button onClick={onRotate}>Tourner</button>
    </div>
  );
};

export default DraggableBoat;