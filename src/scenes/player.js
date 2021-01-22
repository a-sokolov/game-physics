import { SpriteSheet } from '../sprite-sheet'
import { ShapeFactory } from '../shape-factory'
import { Controller } from '../controller'

export class Player {
  constructor({ game, speed, gravity, jump, tileProps, keymap, position }) {
    this.game = game
    this.screen = this.game.screen
    this.controller = new Controller(keymap)
    this.gameSpeed = speed
    this.playerJump = jump
    this.gravity = gravity

    this.movement = 0
    this.isJumped = true

    this.tiles = new SpriteSheet(tileProps)

    this.stop = this.tiles.getSprite(1)
    this.jump = this.tiles.getSprite(9)

    this.moveLeft = this.tiles.getAnimation([5, 6, 7, 8], 200)
    this.moveRight = this.tiles.getAnimation([13, 14, 15, 16], 200)

    this.current = this.stop

    this.shapeFactory = new ShapeFactory()
    this.rect = this.shapeFactory.createRect(
      position.x,
      position.y,
      tileProps.width,
      tileProps.height,
      'red')
  }

  update() {
    const { mob } = this.rect

    if (this.controller.left || this.controller.right) {
      if (this.controller.left) {
        this.speed = -this.gameSpeed
        this.current = this.moveLeft
      }
      if (this.controller.right) {
        this.speed = this.gameSpeed
        this.current = this.moveRight
      }

      if (this.isJumped) {
        this.speed *= 0.75
      }
      mob.position.x += this.speed
    } else {
      if (this.isJumped) {
        this.current = this.jump
      } else {
        this.current = this.stop
      }
    }

    if (this.controller.jump && !this.isJumped) {
      this.isJumped = true
      this.movement = 0
      this.movement -= this.playerJump
    }

    this.movement += this.gravity
    mob.position.y += this.movement
    if (mob.position.y + mob.height >= this.screen.height) {
      this.isJumped = false
      mob.position.y = this.screen.height - mob.height
    }

    if (mob.position.x <= 0) {
      mob.position.x = 0
      this.current = this.stop
    }
    if (mob.position.x + mob.width >= this.screen.width) {
      mob.position.x = this.screen.width - mob.width
      this.current = this.stop
    }

    this.current.setXY(mob.position.x, mob.position.y)
  }

  render(time) {
    this.update(time)
    this.current.update?.(time)
    this.screen.drawSprite(
      this.current,
      this.rect.mob.width,
      this.rect.mob.height)
  }
}