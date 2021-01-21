import { Vector } from './vector'

export class Mob {
  constructor(x, y, velocityX, velocityY, speed) {
    this.position = new Vector(x, y)
    this.velocity = new Vector(velocityX, velocityY)
    this.speed = speed
  }

  move() {
    this.position.addTo(this.velocity)
  }

  setPosition(v) {
    this.position.x = v.x
    this.position.y = v.y
  }

  setVelocityX(velocityX) {
    this.velocity.x = velocityX
  }

  setVelocityY(velocityY) {
    this.velocity.y = velocityY
  }
}