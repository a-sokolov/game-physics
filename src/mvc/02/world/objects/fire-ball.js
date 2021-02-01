import { MovingObject } from '../../base/moving-object'

export class FireBall extends MovingObject {
  constructor({ x, y, width, height, speed = 5.55, directionX = -1, index }) {
    super(x, y, width, height)

    this.index = index
    this.speed = speed
    this.directionX = directionX
  }
  
  update() {
    this.oldX = this.x
    this.oldY = this.y

    this.x += (this.speed * this.directionX)
  }
}