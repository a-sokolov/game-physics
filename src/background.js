import { Direction, ParallaxImage } from './parallax-image'
import { Img } from './img'

export class Background {
  constructor(screen, speed) {
    this.screen = screen

    this.sun = new Img({ imageName: 'sun', x: -60, y: -80, width: 276.5, height: 358.5 })
    this.cloud1 = new ParallaxImage({
      imageName: 'mid-cloud1',
      y: 150,
      width: screen.width,
      height: screen.height / 2,
      step: 0.025,
      autorun: true,
      direction: Direction.backward
    })

    this.cloud2 = new ParallaxImage({
      imageName: 'mid-cloud2',
      y: 300,
      width: screen.width,
      height: screen.height / 3,
      step: 0.020,
      autorun: true
    })

    this.farground = new ParallaxImage({
      imageName: 'far-ground',
      y: screen.height - 320,
      width: screen.width,
      height: 320,
      step: speed * 0.02,
    })
    this.midground = new ParallaxImage({
      imageName: 'mid-ground',
      y: screen.height - 120,
      width: screen.width,
      height: 120,
      step: speed * 0.2
    })
    this.foreground = new ParallaxImage({
      imageName: 'foreground',
      y: screen.height - 50,
      width: screen.width,
      height: 50,
      step: speed
    })

    this.images = [this.farground, this.midground, this.foreground]
  }

  run(direction) {
    this.images.forEach(image => image.run(direction))
  }

  stop() {
    this.images.forEach(image => image.stop())
  }

  render(time) {
    this.cloud1.update(time)
    this.cloud2.update(time)

    this.images.forEach(image => {
      image.update(time)
    })

    this.screen.drawImg(this.sun)

    this.screen.drawParallaxImage(this.cloud1)
    this.screen.drawParallaxImage(this.cloud2)

    this.images.forEach(image => {
      this.screen.drawParallaxImage(image)
    })
  }
}