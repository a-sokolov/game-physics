import { SpriteSheet } from './sprite-sheet'
import { Animator, AnimatorMode } from './animator'
import { Rect } from '../base/rect'

export class StaticMapAnimation {
  constructor(points, tileProps, { frames, delay }) {
    const tiles = new SpriteSheet(tileProps)
    this.points = points
    this.objects = []

    points.forEach(point => {
      const animationFrames = tiles.getAnimationFrames(...frames)
      animationFrames.setXY(point.x, point.y)
      animationFrames.imageWidth = point.width
      animationFrames.imageHeight = point.height

      const index = Math.floor(Math.random() * frames.length)

      const object = new Animator(animationFrames, delay, AnimatorMode.loop)
      object.frameIndex = index

      this.objects.push(object)
    })
  }

  removePoints(pointsToRemove) {
    this.points = this.points.filter(point => {
      return !pointsToRemove.find(toRemove => toRemove === point)
    })

    this.objects = this.objects.filter(object => {
      return !pointsToRemove.some(toRemove => {
        const { x, y, imageWidth, imageHeight } = object.animation
        return Rect.equals(toRemove, { x, y, width: imageWidth, height: imageHeight })
      })
    })
  }

  update() {
    this.objects.forEach(object => object.animate())
  }
}