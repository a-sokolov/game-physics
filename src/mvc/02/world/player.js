import { Rect } from '../base/rect'

export class Player extends Rect {
  constructor({ x, y, width, height, jumpPower = 20, speed = 0.5 }) {
    super(x, y, width, height)

    this.jumpPower = jumpPower
    this.speed = speed

    this.jumping = true
    this.velocityX = 0
    this.velocityY = 0
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true
      this.velocityY -= this.jumpPower
    }
  }

  moveLeft() {
    this.velocityX -= this.speed
  }

  moveRight() {
    this.velocityX += this.speed
  }

  update() {
    this.oldX = this.x
    this.oldY = this.y

    this.x += this.velocityX
    this.y += this.velocityY
  }
}