import { SpriteSheet } from './sprite-sheet'
import { Rect } from './shapes/rect'
import { Controller } from './controller'
import { FLOOR_Y, JUMP_SPEED_GAP } from './constants'

export const PlayerDirection = {
  left: 'left',
  right: 'right'
}
export class Player {
  constructor({ game, speed, gravity, jump, tileProps, keymap, position }) {
    this.game = game
    this.screen = this.game.screen
    this.controller = new Controller(keymap)
    this.gameSpeed = speed
    this.playerJump = jump
    this.gravity = gravity

    this.direction = null
    this.movement = 0
    this.isJumped = true

    this.tiles = new SpriteSheet(tileProps)

    this.stop = this.tiles.getSprite(1)
    this.jump = this.tiles.getSprite(9)

    this.jumpLeft = this.tiles.getSprite(6)
    this.jumpRight = this.tiles.getSprite(15)

    this.moveLeft = this.tiles.getAnimation([5, 6, 7, 8], 150)
    this.moveRight = this.tiles.getAnimation([13, 14, 15, 16], 150)

    this.current = this.stop

    this.rect = new Rect(position.x, position.y, tileProps.width, tileProps.height)
  }

  update() {
    if (this.controller.left || this.controller.right) {
      if (this.controller.left) {
        this.speed = -this.gameSpeed
        this.current = this.isJumped ? this.jumpLeft : this.moveLeft
        this.direction = PlayerDirection.left
      }
      if (this.controller.right) {
        this.speed = this.gameSpeed
        this.current = this.isJumped ? this.jumpRight : this.moveRight
        this.direction = PlayerDirection.right
      }

      if (this.isJumped) {
        this.speed *= JUMP_SPEED_GAP
      }
      this.rect.position.x += this.speed
    } else {
      if (this.isJumped) {
        this.current = this.jump
      } else {
        this.current = this.stop
        this.direction = null
      }
    }

    if (this.controller.jump && !this.isJumped) {
      this.isJumped = true
      this.movement = 0
      this.movement -= this.playerJump
    }

    if (this.isJumped) {
      this.movement += this.gravity
      this.rect.position.y += this.movement
    }

    if (this.rect.position.y + this.rect.height >= this.screen.height - FLOOR_Y) {
      this.rect.position.y = this.screen.height - FLOOR_Y - this.rect.height
      if (this.isJumped) {
        this.isJumped = false
        this.current.run?.()
      }
    }

    this.current.setXY(this.rect.position.x, this.rect.position.y)
  }

  render(time) {
    this.update(time)
    this.current.update?.(time)
    this.screen.drawSprite(
      this.current,
      this.rect.width,
      this.rect.height)

    this.screen.drawStroke(this.rect)
  }
}