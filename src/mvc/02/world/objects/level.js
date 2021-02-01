export class Level {
  constructor(tileMap, collisionMap) {
    this.tileMap = tileMap
    this.collisionMap = collisionMap
    this.collisionRects = []
  }
}