import { Img } from './img'

export const Direction = {
  forward: 'forward',
  backward: 'backward'
}

export class ParallaxImage {
  constructor({ name, y = 0, screenWidth, width, height, delay = 10, step = 0,
                direction = Direction.forward, autorun = false, space = 0 }) {

    this.name = name
    this.y = y
    this.baseWidth = width
    this.baseHeight = height
    this.step = step
    this.delay = delay
    this.running = autorun
    this.direction = direction
    this.space = space
    this.count = 0
    this.images = []

    const counts = Math.floor(screenWidth / (width + space)) + 2

    let x = 0
    for (let i = 0; i < counts; i ++) {
      this.images.push(this.createImage(x))
      x += width + space
    }
  }

  createImage(x) {
    return new Img({
      name: this.name,
      x,
      y: this.y,
      width: this.baseWidth,
      height: this.baseHeight
    })
  }

  run(direction = Direction.forward) {
    this.direction = direction
    this.running = true
  }

  stop() {
    this.running = false
  }

  nextFrame() {
    this.count ++

    while(this.count > this.delay) {
      this.count -= this.delay

      this.images.forEach(image => {
        image.setXY(image.x + (this.direction === Direction.forward ? -this.step : this.step), this.y)
      })

      const first = this.images[0]
      const last = this.images[this.images.length - 1]
      const others = this.images.filter((_, index) => index > 0 && index < this.images.length - 1)

      if (this.direction === Direction.forward && (first.x + first.width + this.space <= 0)) {
        first.setXY(last.x + last.width + this.space, this.y)
        this.images = [...others, last, first]
      } else if (this.direction === Direction.backward && (first.x >= 0)) {
        last.setXY(-((last.width + this.space) - first.x), this.y)
        this.images = [last, first, ...others]
      }
    }
  }

  update() {
    if (!this.running) {
      return
    }

    this.nextFrame()
  }
}