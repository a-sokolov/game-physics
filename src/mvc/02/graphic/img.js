export class Img {
  constructor({ name, x = 0, y = 0, width, height }) {
    this.name = name
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  setXY(x, y) {
    this.x = x
    this.y = y
  }
}