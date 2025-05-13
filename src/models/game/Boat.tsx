export type Boat = {
  id: string;
  name: string;
  size: number;
  orientation: "horizontal" | "vertical";
  position: { x: number; y: number } | null; // null = pas encore placé
};