export class Maze {
  sizeX: number;
  sizeY: number;
  horizontalWalls: number[];
  verticalWalls: number[];
  treasure: number | null;

  constructor(size_x: number, size_y: number) {
    this.sizeX = size_x;
    this.sizeY = size_y;
    this.horizontalWalls = Array(size_x * (size_y - 1)).fill(0);
    this.verticalWalls = Array((size_x - 1) * size_y).fill(0);
    this.treasure = null;
  }
}