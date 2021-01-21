import { Scene } from '../scene'
import { ShapeFactory } from '../shape-factory'
import { ShapeDrawer } from '../shape-drawer'
import { ShapeCollision } from '../shape-collision'

const SPEED = 2.55
const SHAPES_LIMITS = 10
const CREATE_SHAPE_TIME = 20
const DELTA = 1/100
const COLORS = ['red', 'yellow', 'white', 'green', 'blue', 'brown', 'orange']
const SIZES = [10]

export class CirclesScene extends Scene {
  constructor(game) {
    super(game)

    this.screen = this.game.screen
    this.shapeFactory = new ShapeFactory()
    this.shapeDrawer = new ShapeDrawer(this.screen)
    this.shapeCollision = new ShapeCollision(this.screen, DELTA)
  }

  init() {
    super.init()

    this.shapes = []
    this.lastTime = 0

    this.createCircle()
  }

  addShape(shape) {
    this.shapes.push(shape)
  }

  moveShapes() {
    this.shapes.forEach(shape => shape.mob.update())
  }

  drawShapes() {
    this.shapes.forEach(shape => this.shapeDrawer.draw(shape))
  }

  createCircle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    const velocityX = Math.random() * SPEED * 1000
    const velocityY = Math.random() * SPEED * 1000
    let radius = SIZES[Math.floor(Math.random() * SIZES.length)]

    const coloredCircle = this.shapeFactory.createBall(
      this.screen.width / 2,
      this.screen.height / 2,
      velocityX, velocityY,
      radius, color)
    this.addShape(coloredCircle)
  }

  render(time) {
    super.render(time)

    if (this.lastTime === 0) {
      this.lastTime = time
    } else if (time - this.lastTime >= CREATE_SHAPE_TIME
      && this.shapes.length < SHAPES_LIMITS) {
      this.lastTime = time
      this.createCircle()
    }

    this.shapeCollision.collision(this.shapes)
    this.moveShapes()
    this.drawShapes()
  }
}