import { Collider } from './collider'
import { Rect } from '../base/rect'
import { Vector } from '../base/vector'
import { getIntersectingRectsSquare } from '../utils'

export const CollideType = {
  top: 'top',
  left: 'left',
  right: 'right',
  bottom: 'bottom'
}

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

  getAllCollisionRects(rect, width, height, filter) {
    const columns = Math.floor(rect.width / width)
    const rows = Math.floor( rect.height / height)

    let x = rect.x
    let y = rect.y

    const rects = []

    let row = 1
    let column = 1

    // Инициализируем все прямоугольники, которые входят в площадь коллизий
    for (let index = 1; index <= rows * columns; index ++) {
      let type
      if (row === 1) {
        type = CollideType.top
      } else if (row === rows) {
        type = CollideType.bottom
      } else {
        if (column === 1) {
          type = CollideType.left
        } else if (column === columns) {
          type = CollideType.right
        }
      }

      if (!filter || filter?.(row, column, rows, columns) ) {
        rects.push({ x, y, width, height, type })
      }

      column ++
      x += width

      if (index % columns === 0) {
        row ++
        column = 1
        x = rect.x
        y += height
      }
    }

    return rects
  }

  /** Функция для инициализации прямоугольников коллизий объекта */
  getCollisionRects(object) {
    const { width, height } = this.level.tileMap.size
    const { bottom, left, right, top } = this.getSizes(object)

    const topLeftV = new Vector(left * width, top * height)
    const topRightV = new Vector(right * width, top * height)
    const bottomLeftV = new Vector(left * width, bottom * height)

    const rects = this.getAllCollisionRects(
                      new Rect(topLeftV.x, topLeftV.y,
                            (topRightV.x + width) - topLeftV.x,
                            (bottomLeftV.y + height) - topLeftV.y),
                      width,
                      height).filter(rect => {
      const square = getIntersectingRectsSquare(object, rect)
      return (square >= (width * height) / 3)
    })

    // Ищем координаты хитбокса игрока
    let x1, y1
    let x2 = 0
    let y2 = 0

    rects.forEach(rect => {
      x1 = Math.min(x1 ?? rect.x, rect.x)
      y1 = Math.min(y1 ?? rect.y, rect.y)
      x2 = Math.max(x2, rect.x + rect.width)
      y2 = Math.max(y2, rect.y + rect.height)
    })

    // Увеличиваем хитбокс на спрайт во все стороны
    x1 -= width
    y1 -= height
    x2 += width
    y2 += height

    return this.getAllCollisionRects(new Rect(x1, y1, x2 - x1, y2 - y1), width, height,
              (row, column, rows, columns) => {
                return  !((row === 1 || row === rows) && (column === 1 || column === columns)
                          || row > 1 && row < rows && (column > 1 && column < columns))
              })
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
    const collisionRects = this.getCollisionRects(object)
    const { size, columns } = this.level.tileMap
    const { width, height } = size

    collisionRects.forEach(rect => {
      const row = Math.floor(rect.y  / height)
      const column = Math.floor(rect.x / width)
      const index = row * columns + column

      let tileX, tileY
      tileX = rect.x
      tileY = rect.y
      switch (rect.type) {
        case CollideType.top:
          break
        case CollideType.left:
          break
        case CollideType.right:
          break
        case CollideType.bottom:
          break
      }

      const value = this.level.collisionMap[index]
      if (value) {
        this.collider.collide(value, index, object, tileX, tileY, size)
      }
    })

    return collisionRects
  }

  collideObject2(object) {
    const { size, columns } = this.level.tileMap
    const { width, height } = size

    let bottom, left, right, top, value, index

    top = this.getSizes(object).top
    left = this.getSizes(object).left
    index = top * columns + left
    value = this.level.collisionMap[index]
    this.collider.collide(value, index, object, left * width, top * height, size)

    top = this.getSizes(object).top
    right = this.getSizes(object).right
    index = top * columns + right
    value = this.level.collisionMap[index]
    this.collider.collide(value, index, object, right * width, top * height, size)

    bottom = this.getSizes(object).bottom
    left = this.getSizes(object).left
    index = bottom * columns + left
    value = this.level.collisionMap[index]
    this.collider.collide(value, index, object, left * width, bottom * height, size)

    bottom = this.getSizes(object).bottom
    right = this.getSizes(object).right
    index = bottom * columns + right
    value = this.level.collisionMap[index]
    this.collider.collide(value, index, object, right * width, bottom * height, size)

    return this.getCollisionRects(object)
  }
}