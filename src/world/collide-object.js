import { Collider } from './collider'
import { Rect } from '../base/rect'

export class CollideObject {
  constructor() {
    this.collider = new Collider()
    this.level = null
  }

  setLevel(level) {
    this.level = level
  }

  getCollisionRects(object) {
    const { width, height } = this.level.tileMap.size
    const { bottom, left, right, top } = this.getSizes(object)

    return [
      new Rect(left * width, top * height, width, height),
      new Rect(right * width, top * height, width, height),
      new Rect(left * width, bottom * height, width, height),
      new Rect(right * width, bottom * height, width, height)
    ]
  }

  getSizes(object) {
    const { width, height } = this.level.tileMap.size

    return {
      top: Math.floor(object.getTop() / height),
      bottom: Math.floor(object.getBottom() / height),
      left: Math.floor(object.getLeft() / width),
      right: Math.floor(object.getRight() / width),
    }
  }

  collideObject(object) {
    const { size, columns } = this.level.tileMap
    const { width, height } = size

    let bottom, left, right, top, value

    top = this.getSizes(object).top
    left = this.getSizes(object).left
    value = this.level.collisionMap[top * columns + left]
    this.collider.collide(value, object, left * width, top * height, size)

    top = this.getSizes(object).top
    right = this.getSizes(object).right
    value = this.level.collisionMap[top * columns + right]
    this.collider.collide(value, object, right * width, top * height, size)

    bottom = this.getSizes(object).bottom
    left = this.getSizes(object).left
    value = this.level.collisionMap[bottom * columns + left]
    this.collider.collide(value, object, left * width, bottom * height, size)

    bottom = this.getSizes(object).bottom
    right = this.getSizes(object).right
    value = this.level.collisionMap[bottom * columns + right]
    this.collider.collide(value, object, right * width, bottom * height, size)

    return this.getCollisionRects(object)
  }
}