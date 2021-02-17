import { MovingObject } from './moving-object'

export class Mob extends MovingObject {
  constructor({ x, y, width, height, velocityMax, jumpPower = 20, speed = 0.55 }) {
    super(x, y, width, height, velocityMax)

    this.jumpPower = jumpPower
    this.speed = speed
    this.directionX = 1
    this.jumping = true
    this.firing = false
    this.crouching = false
    this.idling = false
    this.swordAttack = false
  }

  jump() {
    if (!this.jumping && this.velocityY < 10) {
      this.crouching = false
      this.jumping = true
      this.velocityY -= this.jumpPower
    }
  }

  moveLeft() {
    this.crouching = false
    this.directionX = -1
    this.velocityX -= this.speed
  }

  fire() {
    this.swordAttack = true
    setTimeout(() => this.swordAttack = false, 400)
  }

  moveRight() {
    this.crouching = false
    this.directionX = 1
    this.velocityX += this.speed
  }

  crouch(crouching) {
    if (!this.jumping && !this.firing) {
      this.crouching = crouching
    }
  }

  updatePosition(gravity, friction) {
    this.oldX = this.x
    this.oldY = this.y

    this.velocityY += gravity
    this.velocityX *= friction

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(this.velocityX) > this.velocityMax) {
      this.velocityX = this.velocityMax * Math.sign(this.velocityX)
    }

    if (Math.abs(this.velocityY) > this.velocityMax) {
      this.velocityY = this.velocityMax * Math.sign(this.velocityY)
    }

    this.x += this.velocityX
    this.y += this.velocityY
  }
}