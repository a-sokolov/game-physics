export class Img {
  constructor({ imageName, x = 0, y = 0, width, height }) {
    this.imageName = imageName
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  setXY(x, y) {
    this.x = x
    this.y = y
  }

  setWidth(width) {
    this.width = width
  }

  setHeight(height) {
    this.height = height
  }
}