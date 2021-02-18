import { Collider } from './collider'
import { Rect } from '../base/rect'
import { Vector } from '../base/vector'

/** Клас для вычисления коллизий объекта */
export class CollideObject {
  constructor() {
    this.collider = new Collider()
    this.level = null
  }

  /** Установка уровня, от куда мы будем читать карту коллизий */
  setLevel(level) {
    this.level = level
  }

  /** Функция для инициализации прямоугольников коллизий объекта */
  getCollisionRects(object) {
    const { width, height } = this.level.tileMap.size
    const { bottom, left, right, top } = this.getSizes(object)

    const topLeftV = new Vector(left * width, top * height)
    const topRightV = new Vector(right * width, top * height)
    const bottomLeftV = new Vector(left * width, bottom * height)

    // Вычисляем общую площадь коллизий
    const columns = Math.floor(((topRightV.x + width) - topLeftV.x) / width)
    const rows = Math.floor( ((bottomLeftV.y + height) - topLeftV.y) / height)

    let x = topLeftV.x
    let y = topLeftV.y

    const rects = []

    // Инициализируем все прямоугольники, которые входя в площадь коллизий
    for (let index = 1; index <= rows * columns; index ++) {
      rects.push(new Rect(x, y, width, height))
      x += width
      if (index % columns === 0) {
        x = topLeftV.x
        y += height
      }
    }

    return rects
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