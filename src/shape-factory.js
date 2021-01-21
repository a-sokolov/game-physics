import { Shape } from './shape'
import { Circle } from './circle'

export class ShapeFactory {
  constructor(speed) {
    this.speed = speed
  }

  createBall(x, y, velocityX, velocityY, radius, color) {
    return new Shape(new Circle(x, y, velocityX, velocityY, this.speed, radius), color)
  }
}