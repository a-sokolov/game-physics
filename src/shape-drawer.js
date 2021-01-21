import { Circle } from './shapes/circle'
import { Rect } from './shapes/rect'

export class ShapeDrawer {
  constructor(screen) {
    this.screen = screen
  }

  draw(shape) {
    const { mob, color } = shape
    if (mob instanceof Circle) {
      this.screen.drawCircle(mob, color)
    }
    if (mob instanceof Rect) {
      this.screen.drawRect(mob, color)
    }
  }
}