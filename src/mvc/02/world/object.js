export class Object {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.oldX = x
    this.oldY = y
  }

  getBottom() {
    return this.y + this.height
  }

  getLeft() {
    return this.x
  }

  getRight() {
    return this.x + this.width
  }
  
  getTop() {
    return this.y
  }
  
  getOldBottom() {
    return this.oldY + this.height
  }
  
  getOldLeft() {
    return this.oldX
  }
  
  getOldRight() {
    return this.oldX + this.width
  }
  
  getOldTop() {
    return this.oldY
  }
  
  setBottom(y) {
    this.y = y - this.height
  }
  
  setLeft(x) {
    this.x = x
  }
  
  setRight(x) {
    this.x = x - this.width
  }
  
  setTop(y) {
    this.y = y
  }
  
  setOldBottom(y) {
    this.oldY = y - this.height
  }
  
  setOldLeft(x) {
    this.oldX = x
  }
  
  setOldRight(x) {
    this.oldX = x - this.width
  }

  setOldTop(y) {
    this.oldY = y
  }
}