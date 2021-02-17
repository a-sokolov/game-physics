import { Img } from './img'

export const Direction = {
  forward: 'forward',
  backward: 'backward'
}

export class ParallaxImage {
  constructor({ name, x = 0, y = 0, width, height, step = 0, direction = Direction.forward, autorun = false, sticky = true }) {

    this.name = name
    this.baseX = x
    this.baseY = y
    this.x = x
    this.y = y
    this.baseWidth = width
    this.baseHeight = height
    this.step = step
    this.running = autorun
    this.sticky = sticky
    this.direction = direction

    this.images = []
    this.images.push(this.createImage(x))
    this.images.push(this.createImage(width))
    this.images.push(this.createImage(width * 2))
  }

  // setY(y) {
  //   this.y = y
  //   this.images.forEach(image => image.y = y)
  // }

  createImage(x) {
    return new Img({
      name: this.name,
      x,
      y: this.baseY,
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
    this.images.forEach(image => {
      image.setXY(image.x + (this.direction === Direction.forward ? -this.step : this.step), this.y)
    })

    const [first, second, third] = this.images
    if (this.direction === Direction.forward && (first.x + first.width <= 0)) {
      first.setXY(third.x + third.width, this.y)
      this.images = [second, third, first]
    } else if (this.direction === Direction.backward && (first.x >= 0)) {
      third.setXY(-(third.width - first.x), this.y)
      this.images = [third, first, second]
    }
  }

  update() {
    if (!this.running) {
      return
    }

    this.nextFrame()
  }
}