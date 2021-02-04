export class Rect {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  static equals(rect1, rect2) {
    return rect1.x === rect2.x
      && rect1.y === rect2.y
      && rect1.width === rect2.width
      && rect1.height === rect2.height
  }
}