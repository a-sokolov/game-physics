export class Player {
  constructor() {
    this.color1 = "#404040"
    this.color2 = "#f0f0f0"

    this.jumping = true
    this.velocityX = 0
    this.velocityY = 0

    this.x = 100
    this.y = 50
    this.width = 12
    this.height = 12
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true
      this.velocityY -= 20
    }
  }

  moveLeft() {
    this.velocityX -= 0.5
  }

  moveRight() {
    this.velocityX += 0.5
  }

  update() {
    this.x += this.velocityX
    this.y += this.velocityY
  }
}