import { Scene } from '../scene'
import { ShapeFactory } from '../shape-factory'
import { ShapeDrawer } from '../shape-drawer'

const GRAVITY = 0.85
const JUMP = 12
const SPEED = 5.5

export class MovementScene extends Scene {
  constructor(game) {
    super(game)

    this.screen = game.screen
    this.controller = game.controller

    this.shapeFactory = new ShapeFactory()
    this.shapeDrawer = new ShapeDrawer(this.screen)
  }

  init() {
    super.init()

    this.speed = SPEED
    this.movement = 0
    this.isJumped = true
    this.rect = this.shapeFactory.createRect(10, 10, 25, 25, 'red')
  }

  update() {
    const { mob } = this.rect

    if (this.controller.left || this.controller.right) {
      if (this.controller.left) {
        this.speed = -SPEED
      }
      if (this.controller.right) {
        this.speed = SPEED
      }

      if (this.isJumped) {
        this.speed *= 0.75
      }
      mob.position.x += this.speed
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
    }
    if (mob.position.x + mob.width >= this.screen.width) {
      mob.position.x = this.screen.width - mob.width
    }
  }

  render(time) {
    super.render(time)
    this.update()
    this.shapeDrawer.draw(this.rect)
  }
}