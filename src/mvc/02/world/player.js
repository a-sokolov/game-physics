import { Rect } from '../base/rect'

export class Player extends Rect {
  constructor({ x, y, width, height, jumpPower = 20, speed = 0.5, collisionOffsets }) {
    super(x, y, width, height)

    this.jumpPower = jumpPower
    this.speed = speed

    this.jumping = true
    this.velocityX = 0
    this.velocityY = 0
    this.collisionOffsets = collisionOffsets
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

  // getLeft() {
  //   if (this.collisionOffsets?.bottom) {
  //     return this.x + this.collisionOffsets.bottom.start
  //   }
  //   return super.getLeft()
  // }
  //
  // getRight() {
  //   if (this.collisionOffsets?.bottom) {
  //     return super.getRight() - this.collisionOffsets.bottom.end
  //   }
  //   return super.getRight()
  // }
  //
  // getOldLeft() {
  //   if (this.collisionOffsets?.bottom) {
  //     return this.oldX + this.collisionOffsets.bottom.start
  //   }
  //   return super.getOldLeft()
  // }
  //
  // getOldRight() {
  //   if (this.collisionOffsets?.bottom) {
  //     return super.getOldRight() - this.collisionOffsets.bottom.end
  //   }
  //   return super.getOldRight()
  // }
}