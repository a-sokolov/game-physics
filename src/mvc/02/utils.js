import { Rect } from './base/rect'

export const RectPosition = {
  default: 'default',
  center: 'center',
  left: 'left',
  top: 'top',
  bottom: 'bottom',
  right: 'right'
}

/**
 * Функция для чтения позиции прямоугольника относительно размера спрайта
 * @param rect прямоугольник
 * @param position позиция (сейчас реализовано только center)
 * @param spriteSize размеры спрайта
 * */
export const getRectPosition = (rect, position, spriteSize) => {
  const { x, y, width, height } = rect
  const { width: baseWidth, height: baseHeight } = spriteSize

  let newX = x
  let newY = y

  switch (position) {
    case RectPosition.center:
      newX = x + (baseWidth / 2) - (width / 2)
      newY = y + (baseHeight / 2) - (height / 2)
      break
  }

  return { x: newX, y: newY }
}

export const getTileMapPoints = (tileMap, props) => {
  const { imageName, tileIndex, size, columns, map } = tileMap
  const { width, height, position } = props ?? {}

  const points = []

  for (let index = map.length - 1; index > -1; -- index) {
    if (map[index] === tileIndex) {
      const destinationX = (index % columns) * size.width
      const destinationY = Math.floor(index / columns) * size.height

      const pointRect = new Rect(destinationX, destinationY, width || size.width, height || size.height)
      const newPosition = getRectPosition(pointRect, position, size)

      points.push({
        name: imageName,
        x: newPosition.x,
        y: newPosition.y,
        width: pointRect.width,
        height: pointRect.height,
      })
    }
  }

  return points
}

/**
 * Функция для чтения коллизии между 2мя прямоугольниками
 * @return boolean true - если коллизия есть
 * */
export const checkRectCollision = (rect1, rect2) => {
  return (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y)
}