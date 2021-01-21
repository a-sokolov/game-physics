import { Shape } from './shape'
import { Circle } from './shapes/circle'
import { Rect } from './shapes/rect'

export class ShapeFactory {
  constructor() {
    //
  }

  createBall(x, y, velocityX, velocityY, radius, color) {
    return new Shape(new Circle(x, y, velocityX, velocityY, radius), color)
  }

  createRect(x, y, width, height, color) {
    return new Shape(new Rect(x, y, width, height), color)
  }
}