import { Screen } from './screen'
import { ShapeFactory } from './shape-factory'
import { ShapeDrawer } from './shape-drawer'
import { ShapeCollision } from './shape-collision'

const CANVAS = {
  width: 1200,
  height: 800
}
const SPEED = 2.15
const SHAPES_LIMITS = 50
const CREATE_SHAPE_TIME = 20
const DELTA = 1/100
const COLORS = ['red', 'yellow', 'white', 'green', 'blue', 'brown', 'orange']
const SIZES = [5]

export class Game {
  constructor() {
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.shapeFactory = new ShapeFactory(SPEED)
    this.shapeDrawer = new ShapeDrawer(this.screen)
    this.shapeCollision = new ShapeCollision(this.screen, DELTA)
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

  frame(time) {
    if (this.lastTime === 0) {
      this.lastTime = time
    } else if (time - this.lastTime >= CREATE_SHAPE_TIME
        && this.shapes.length < SHAPES_LIMITS) {
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