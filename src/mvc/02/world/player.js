export class Player {
  constructor({ x, y, width, height, jumpPower = 20, speed = 0.5 }) {
    this.jumpPower = jumpPower
    this.speed = speed

    this.jumping = true
    this.velocityX = 0
    this.velocityY = 0

    this.x = x
    this.y = y
    this.width = width
    this.height = height
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
    this.x += this.velocityX
    this.y += this.velocityY
  }
}