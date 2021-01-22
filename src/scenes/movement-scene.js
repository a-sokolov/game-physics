import { Scene } from '../scene'
import { ShapeFactory } from '../shape-factory'
import { SpriteSheet } from '../sprite-sheet'

const GRAVITY = 0.85
const JUMP = 12
const SPEED = 5.5

const RICK_TILES = {
  imageName: 'rick-tiles',
  imageWidth: 512,
  imageHeight: 660,
  spriteWidth: 128,
  spriteHeight: 165
}

export class MovementScene extends Scene {
  constructor(game) {
    super(game)

    this.screen = game.screen
    this.controller = game.controller

    this.rickTiles = new SpriteSheet(RICK_TILES)

    this.rickStop = this.rickTiles.getSprite(1)
    this.rickJump = this.rickTiles.getSprite(9)

    // this.rickMoveDown = this.rickTiles.getAnimation([1, 2, 3, 4], 200)
    this.rickMoveLeft = this.rickTiles.getAnimation([5, 6, 7, 8], 200)
    this.rickMoveRight = this.rickTiles.getAnimation([13, 14, 15, 16], 200)

    this.rickCurrent = this.rickStop

    this.shapeFactory = new ShapeFactory()
  }

  init() {
    super.init()

    this.speed = SPEED
    this.movement = 0
    this.isJumped = true

    this.rect = this.shapeFactory.createRect(
      this.screen.width / 2 - (RICK_TILES.spriteWidth / 2) / 2, 10,
      RICK_TILES.spriteWidth / 2,
      RICK_TILES.spriteHeight / 2,
      'red')
  }

  update() {
    const { mob } = this.rect

    if (this.controller.left || this.controller.right) {
      if (this.controller.left) {
        this.speed = -SPEED
        this.rickCurrent = this.rickMoveLeft
      }
      if (this.controller.right) {
        this.speed = SPEED
        this.rickCurrent = this.rickMoveRight
      }

      if (this.isJumped) {
        this.speed *= 0.75
      }
      mob.position.x += this.speed
    } else {
      if (this.isJumped) {
        this.rickCurrent = this.rickJump
      } else {
        this.rickCurrent = this.rickStop
      }
    }

    if (this.controller.jump && !this.isJumped) {
      this.isJumped = true
      this.movement = 0
      this.movement -= JUMP
    }

    this.movement += GRAVITY
    mob.position.y += this.movement
    if (mob.position.y + mob.height >= this.screen.height) {
      this.isJumped = false
      mob.position.y = this.screen.height - mob.height
    }

    if (mob.position.x <= 0) {
      mob.position.x = 0
      this.rickCurrent = this.rickStop
    }
    if (mob.position.x + mob.width >= this.screen.width) {
      mob.position.x = this.screen.width - mob.width
      this.rickCurrent = this.rickStop
    }

    this.rickCurrent.setXY(mob.position.x, mob.position.y)
  }

  render(time) {
    super.render(time)
    this.update()

    this.rickCurrent.update?.(time)
    this.screen.drawSprite(
      this.rickCurrent,
      this.rect.mob.width,
      this.rect.mob.height)
  }
}