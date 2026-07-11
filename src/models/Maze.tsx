import { Direction } from '../enums/Direction';

export class Maze {
  sizeX: number;
  sizeY: number;
  horizontalWalls: Uint8Array;
  verticalWalls: Uint8Array;
  treasure: number | null;

  constructor(size_x: number, size_y: number) {
    this.sizeX = size_x;
    this.sizeY = size_y;
    this.horizontalWalls = new Uint8Array(size_x * (size_y - 1)).fill(0);
    this.verticalWalls = new Uint8Array((size_x - 1) * size_y).fill(0);
    this.treasure = null;
  }

  addOrRemoveWall(cellIndex: number, direction: Direction, onlyAddWall: boolean = false): void {
    let wallIndex: number = this.getWallIndex(cellIndex, direction);

    if (wallIndex < 0) {
      return;
    }
    
    if (direction == Direction.RIGHT || direction == Direction.LEFT) {
      if (wallIndex < this.verticalWalls.length)
        this.verticalWalls[wallIndex] = this.verticalWalls[wallIndex] == 0 || onlyAddWall ? 1 : 0;
    } else {
      if (wallIndex < this.horizontalWalls.length)
        this.horizontalWalls[wallIndex] = this.horizontalWalls[wallIndex] == 0 || onlyAddWall ? 1 : 0;
    }
  }

  hasWall(cellIndex: number, direction: Direction): boolean {
    let wallIndex: number = this.getWallIndex(cellIndex, direction);

    if (wallIndex < 0) {
      return false;
    }
    
    if (direction == Direction.RIGHT || direction == Direction.LEFT) {
      if (wallIndex < this.verticalWalls.length)
        return this.verticalWalls[wallIndex] == 1;
    } else {
      if (wallIndex < this.horizontalWalls.length)
        return this.horizontalWalls[wallIndex] == 1;
    }
    return false;
  }

  getWallIndex(cellIndex: number, direction: Direction): number {
    switch (direction) {
      case Direction.UP:
        if (cellIndex < this.sizeX)
          return -1;
        return cellIndex - this.sizeX;
      case Direction.RIGHT:
        if ((cellIndex + 1) % this.sizeX == 0)
          return -1;
        return cellIndex - Math.trunc(cellIndex / this.sizeX);
      case Direction.DOWN:
        if (cellIndex >= this.sizeX * (this.sizeY - 1))
          return -1;
        return cellIndex;
      case Direction.LEFT:
        if (cellIndex % this.sizeX == 0)
          return -1;
        return cellIndex - (Math.trunc(cellIndex / this.sizeX) + 1);
      default:
        return -1;
    }
  }
}