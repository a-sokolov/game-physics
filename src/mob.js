import { Vector } from './vector'

export class Mob {
  constructor(x, y, velocityX, velocityY, speed) {
    this.position = new Vector(x, y)
    this.velocity = new Vector(velocityX, velocityY)
    this.nextPosition = Vector.zero()
    this.speed = speed
  }

  update() {
    if (!this.nextPosition.isZero()) {
      this.position = this.nextPosition.copy()
    }
  }
}