export type CellProps = {
  x: number;
  y: number;
  state: "empty" | "ship" | "hit" | "miss";
  onDrop: (x: number, y: number, item?: any) => void;
  disabled?: boolean;
};