export class Display {
  constructor(canvas) {
    this.buffer = document.createElement('canvas').getContext('2d')
    this.context = canvas.getContext('2d')
    this.images = []
  }

  setImages(images) {
    this.images = images
  }

  getImage(name) {
    return this.images[name]
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

    this.context.imageSmoothingEnabled = false
  }

  drawPlayer(rect, color1, color2) {
    this.buffer.fillStyle = color1
    this.buffer.fillRect(Math.floor(rect.x), Math.floor(rect.y), rect.width, rect.height)
    this.buffer.fillStyle = color2
    this.buffer.fillRect(Math.floor(rect.x + 2), Math.floor(rect.y + 2), rect.width - 4, rect.height - 4)
  }

  drawSprite(sprite, width, height) {
    let destinationX = sprite.x
    let destinationY = sprite.y

    if (!this.isNeedToDraw({
      x: destinationX,
      y: destinationY,
      width: width || sprite.width,
      height: height || sprite.height })) {
      return
    }

    this.buffer.drawImage(this.getImage(sprite.name),
      sprite.sourceX,
      sprite.sourceY,
      sprite.width,
      sprite.height,
      destinationX,
      destinationY,
      width || sprite.width,
      height || sprite.height)
  }

  fill(color) {
    this.buffer.fillStyle = color
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
  }

  render() {
    this.context.drawImage(this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height)
  }
}