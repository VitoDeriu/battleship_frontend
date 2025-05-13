import {CellProps} from "./CellProps";

export type GameGridProps = {
  grid: CellProps[][];
  onCellClick?: (x: number, y: number, draggedItem?: { id: string, size: number, name: string, orientation: "horizontal" | "vertical" }) => void;
  disabled?: boolean;
};