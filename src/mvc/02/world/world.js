import { Player } from './player'

export class World {
  constructor(friction, gravity) {
    this.backgroundColor = 'orange'
    this.width = 1024 / 10
    this.height = 640 / 10

    this.friction = friction
    this.gravity = gravity

    this.player = new Player()
  }

  collideObject(object) {
    if (object.x < 0) {
      object.x = 0
      object.velocityX = 0
    } else if (object.x + object.width > this.width) {
      object.x = this.width - object.width
      object.velocityX = 0
    } if (object.y < 0) {
      object.y = 0
      object.velocityY = 0
    } else if (object.y + object.height > this.height) {
      object.jumping = false
      object.y = this.height - object.height
      object.velocityY = 0
    }
  }

  update() {
    this.player.velocityY += this.gravity
    this.player.update()

    this.player.velocityX *= this.friction
    this.player.velocityY *= this.friction

    this.collideObject(this.player)
  }
}