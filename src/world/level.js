import { getTileMapPoints } from '../utils'

export class Level {
  constructor(tileMap, collisionMap) {
    this.tileMap = tileMap
    this.mapSprites = getTileMapPoints(tileMap)
    this.collisionMap = collisionMap
    this.collisionRects = []
    this.staticAnimations = []
  }

  addStaticAnimation(animation) {
    this.staticAnimations.push(animation)
  }

  update() {
    this.staticAnimations.forEach(staticAnimation => staticAnimation.update())
  }
}