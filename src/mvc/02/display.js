import { Sprite } from './graphic/sprite'

export class Display {
  constructor(canvas, debug = false) {
    this.buffer = document.createElement('canvas').getContext('2d')
    this.context = canvas.getContext('2d')
    this.images = []
    this.camera = null

    this.isDebug = debug
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

  drawMap(tileMap) {
    const { imageName, size, columns, map } = tileMap

    for (let index = map.length - 1; index > -1; -- index) {
      if (map[index] === 1) {
        const destinationX = (index % columns) * size
        const destinationY = Math.floor(index / columns) * size

        const sprite = new Sprite({
          name: imageName,
          x: destinationX,
          y: destinationY,
          width: size,
          height: size
        })

        this.drawSprite(sprite)
      }
    }
  }

  drawSprite(sprite, width, height, offsetX = 0, offsetY = 0) {
    let destinationX = Math.round(sprite.x)
    let destinationY = Math.round(sprite.y)
    let destinationWidth = width || sprite.width
    let destinationHeight = height || sprite.height

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
    destinationWidth += (offsetX * 2)
    destinationHeight += (offsetY * 2)

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
      this.drawStroke(destinationX, destinationY, destinationWidth, destinationHeight)
    }
  }

  drawStroke(x, y, width, height, color = 'black') {
    this.buffer.strokeStyle = color
    this.buffer.strokeRect(x, y, width, height)
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