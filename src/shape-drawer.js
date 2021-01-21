import { Circle } from './circle'

export class ShapeDrawer {
  constructor(screen) {
    this.screen = screen
  }

  draw(shape) {
    const { mob, color } = shape
    if (mob instanceof Circle) {
      this.screen.drawCircle(mob, color)
    }
  }
}