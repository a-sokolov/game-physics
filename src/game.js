import { Screen } from './screen'
import { ShapeFactory } from './shape-factory'
import { ShapeDrawer } from './shape-drawer'
import { ShapeCollision } from './shape-collision'

const CANVAS = {
  width: 100,
  height: 100
}
const SPEED = 2
const SHAPE_LIMITS = 2
const CREATE_SHAPE_TIME = 500
const COLORS = ['red', 'yellow', 'white', 'green', 'blue', 'brown', 'orange']
const SIZES = [10]

export class Game {
  constructor() {
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.shapeFactory = new ShapeFactory(SPEED)
    this.shapeDrawer = new ShapeDrawer(this.screen)
    this.shapeCollision = new ShapeCollision(this.screen)
    this.shapes = []
    this.lastTime = 0

    this.createCircle()
  }

  addShape(shape) {
    this.shapes.push(shape)
  }

  moveShapes() {
    this.shapes.forEach(shape => shape.mob.move())
  }

  drawShapes() {
    this.shapes.forEach(shape => this.shapeDrawer.draw(shape))
  }

  createCircle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]

    const velocityX = Math.random() * SPEED
    const velocityY = Math.random() * SPEED
    let radius = SIZES[Math.floor(Math.random() * SIZES.length)]

    this.addShape(this.shapeFactory.createBall(
      this.screen.width / 2, this.screen.height / 2, velocityX, velocityY, radius, color))
  }

  frame(time) {
    if (this.lastTime === 0) {
      this.lastTime = time
    } else if (time - this.lastTime >= CREATE_SHAPE_TIME
        && this.shapes.length <= SHAPE_LIMITS - 1) {
      this.lastTime = time
      this.createCircle()
    }

    this.screen.fill('black')
    this.shapeCollision.collision(this.shapes)
    this.moveShapes()
    this.drawShapes()

    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    requestAnimationFrame(time => this.frame(time))
  }
}