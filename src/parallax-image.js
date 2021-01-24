import { Img } from './img'

export const Direction = {
  forward: 'forward',
  backward: 'backward'
}

export class ParallaxImage {
  constructor({ imageName, x = 0, y = 0, width, height, step, direction = Direction.forward, autorun = false }) {

    this.imageName = imageName
    this.baseX = x
    this.baseY = y
    this.baseWidth = width
    this.baseHeight = height
    this.step = step
    this.running = autorun
    this.direction = direction

    this.images = []
    this.images.push(this.createImage(x))
    this.images.push(this.createImage(width))
    this.images.push(this.createImage(width * 2))
  }

  createImage(x) {
    return new Img({
      imageName: this.imageName,
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
      image.setXY(image.x + (this.direction === Direction.forward ? -this.step : this.step), this.baseY)
    })

    const [first, second, third] = this.images
    if (this.direction === Direction.forward && (first.x + first.width <= 0)) {
      first.setXY(third.x + third.width, this.baseY)
      this.images = [second, third, first]
    } else if (this.direction === Direction.backward && (first.x >= 0)) {
      third.setXY(-(third.width - first.x), this.baseY)
      this.images = [third, first, second]
    }
  }

  update(time) {
    if (!this.running) {
      return
    }

    this.nextFrame()
  }
}