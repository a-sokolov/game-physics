import { Direction, ParallaxImage } from '../../graphic/parallax-image'
import { Img } from '../../graphic/img'

export class Background {
  constructor(screenRect, speed) {
    this.speed = speed
    this.sun = new Img({ name: 'sun', x: -60, y: -80, width: 276.5, height: 358.5 })

    this.cloud1 = new ParallaxImage({
      name: 'mid-cloud1',
      y: 100,
      width: screenRect.width,
      height: screenRect.height / 2,
      step: 0.025,
      autorun: true,
      direction: Direction.backward
    })

    this.cloud2 = new ParallaxImage({
      name: 'mid-cloud2',
      y: 250,
      width: screenRect.width,
      height: screenRect.height / 3,
      step: 0.020,
      autorun: true
    })

    this.farground = new ParallaxImage({
      name: 'far-ground',
      y: screenRect.height - 400,
      width: screenRect.width,
      height: 320,
      step: speed * 0.02,
    })

    this.midground = new ParallaxImage({
      name: 'mid-ground',
      y: screenRect.height - 230,
      width: screenRect.width,
      height: 230,
      step: speed * 0.2
    })

    this.foreground = new ParallaxImage({
      name: 'foreground',
      y: screenRect.height - 128,
      width: screenRect.width,
      height: 64,
      step: speed,
      sticky: false
    })

    this.images = [this.farground, this.midground, this.foreground]
  }

  run(direction) {
    this.images.forEach(image => image.run(direction))
  }

  stop() {
    this.images.forEach(image => image.stop())
  }

  update(time) {
    this.cloud1.update(time)
    this.cloud2.update(time)

    this.images.forEach(image => {
      image.update(time)
    })
  }
}