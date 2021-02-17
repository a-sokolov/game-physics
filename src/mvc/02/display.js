import { Sprite } from './graphic/sprite'
import { getTileMapPoints } from './utils'

export class Display {
  constructor(canvas, isDebug = false) {
    this.buffer = document.createElement('canvas').getContext('2d')
    this.context = canvas.getContext('2d')
    this.images = []
    this.camera = null

    this.isDebug = isDebug
  }

  setImages(images) {
    this.images = images
  }

  getImage(name) {
    return this.images[name]
  }

  setCamera(camera) {
    this.camera = camera
  }

  isNeedToDraw(x, y, width, height) {
    return !((x >= this.context.canvas.width) ||
      (y >= this.context.canvas.height) ||
      ((x + width) <= 0) ||
      ((y + height) <= 0))
  }

  resize(width, height, heightWidthRatio) {
    if (height / width > heightWidthRatio) {
      this.context.canvas.height = width * heightWidthRatio
      this.context.canvas.width = width
    } else {
      this.context.canvas.height = height
      this.context.canvas.width = height / heightWidthRatio
    }

    this.context.imageSmoothingEnabled = true
  }

  drawMapSprites(points) {
    points.forEach(point => {
      const sprite = new Sprite(point)
      this.drawSprite(sprite)
    })
  }

  drawStaticAnimation(staticAnimation) {
    staticAnimation.objects.forEach(object => {
      this.drawSprite(object.animation)
    })
  }

  drawParallaxImage(parallaxImage, sticky = true) {
    parallaxImage.images.forEach(img => {
      let destinationY = Math.round(img.y)

      if (!sticky && this.camera) {
        destinationY -= this.camera.y
      }

      this.drawImg({ ...img, y: destinationY })
    })
  }

  drawImg(img) {
    if (!this.isNeedToDraw(img)) {
      return
    }

    this.buffer.drawImage(
      this.getImage(img.name),
      img.x,
      img.y,
      img.width,
      img.height)
  }

  drawSprite(sprite, props) {
    const { width, height, offsetX = 0, offsetY = 0 } = props ?? {}

    let destinationX = Math.round(sprite.x)
    let destinationY = Math.round(sprite.y)
    let destinationWidth = width || sprite.imageWidth || sprite.width
    let destinationHeight = height || sprite.imageHeight || sprite.height

    if (!this.isNeedToDraw({
      x: destinationX,
      y: destinationY,
      width: destinationWidth,
      height: destinationHeight
    })) {
      return
    }

    destinationX += offsetX
    destinationY += offsetY
    destinationWidth += (Math.abs(offsetX) * 2)
    destinationHeight += (Math.abs(offsetY) * 2)

    if (this.camera) {
      destinationX -= this.camera.x
      destinationY -= this.camera.y
    }

    this.buffer.drawImage(
      this.getImage(sprite.name),
      sprite.sourceX,
      sprite.sourceY,
      sprite.width,
      sprite.height,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight)

    if (this.isDebug) {
      this.buffer.strokeStyle = 'black'
      this.buffer.strokeRect(destinationX, destinationY, destinationWidth, destinationHeight)
    }
  }

  drawStroke({ x, y, width, height, color = 'black', sticky = false }) {
    let destinationX = Math.round(x)
    let destinationY = Math.round(y)
    let destinationWidth = width
    let destinationHeight = height

    if (!sticky && this.camera) {
      destinationX -= this.camera.x
      destinationY -= this.camera.y
    }

    this.buffer.strokeStyle = color
    this.buffer.strokeRect(destinationX, destinationY, destinationWidth, destinationHeight)
  }

  fill(color) {
    this.buffer.fillStyle = color
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
  }

  render() {
    this.context.drawImage(
      this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height)
  }
}