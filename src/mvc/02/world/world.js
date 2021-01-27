import { Player } from './player'
import { PlayerAnimation } from './player-animation'

export const PLAYER_TILES = {
  name: 'rick-tiles',
  width: 512,
  height: 660,
  spriteWidth: 128,
  spriteHeight: 165
}

export class World {
  constructor(friction = 0.9, gravity = 3) {
    this.backgroundColor = 'orange'
    this.width = 1024
    this.height = 640

    this.friction = friction
    this.gravity = gravity

    this.player = new Player({
      x: 100,
      y: 50,
      width: PLAYER_TILES.spriteWidth / 2,
      height: PLAYER_TILES.spriteHeight / 2,
      jumpPower: 50,
      speed: 1.5 })
    this.playerAnimation = new PlayerAnimation(PLAYER_TILES, 150)
    this.playerAnimation.watch(this.player)
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

  update(time) {
    this.player.velocityY += this.gravity
    this.player.update()
    this.playerAnimation.update(time)

    this.player.velocityX *= this.friction
    this.player.velocityY *= this.friction

    this.collideObject(this.player)
  }
}