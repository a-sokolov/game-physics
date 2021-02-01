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
    const { size } = this.level.tileMap
    const { bottom, left, right, top } = this.getSizes(object)

    return [
      new Rect(left * size, top * size, size, size),
      new Rect(right * size, top * size, size, size),
      new Rect(left * size, bottom * size, size, size),
      new Rect(right * size, bottom * size, size, size)
    ]
  }

  getSizes(object) {
    const { size } = this.level.tileMap

    return {
      top: Math.floor(object.getTop() / size),
      bottom: Math.floor(object.getBottom() / size),
      left: Math.floor(object.getLeft() / size),
      right: Math.floor(object.getRight() / size),
    }
  }

  collideObject(object) {
    const { size, columns } = this.level.tileMap
    let bottom, left, right, top, value

    top = this.getSizes(object).top
    left = this.getSizes(object).left
    value = this.level.collisionMap[top * columns + left]
    this.collider.collide(value, object, left * size, top * size, size)

    top = this.getSizes(object).top
    right = this.getSizes(object).right
    value = this.level.collisionMap[top * columns + right]
    this.collider.collide(value, object, right * size, top * size, size)

    bottom = this.getSizes(object).bottom
    left = this.getSizes(object).left
    value = this.level.collisionMap[bottom * columns + left]
    this.collider.collide(value, object, left * size, bottom * size, size)

    bottom = this.getSizes(object).bottom
    right = this.getSizes(object).right
    value = this.level.collisionMap[bottom * columns + right]
    this.collider.collide(value, object, right * size, bottom * size, size)

    return this.getCollisionRects(object)
  }
}