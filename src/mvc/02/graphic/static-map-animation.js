import { SpriteSheet } from './sprite-sheet'
import { getTileMapPoints } from '../utils'
import { Animator, AnimatorMode } from './animator'

export class StaticMapAnimation {
  constructor(tileMap, tileProps, frames, delay) {
    const tiles = new SpriteSheet(tileProps)

    this.width = tileMap.size
    this.height = tileMap.size
    this.objects = []

    getTileMapPoints(tileMap, (point) => {
      const animationFrames = tiles.getAnimationFrames(...frames)
      animationFrames.setXY(point.x, point.y)
      const index = Math.floor(Math.random() * frames.length)

      const object = new Animator(animationFrames, delay, AnimatorMode.loop)
      object.frameIndex = index

      this.objects.push(object)
    })

    console.log(this.objects)
  }

  update() {
    this.objects.forEach(object => object.animate())
  }
}