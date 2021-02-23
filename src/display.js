import { Sprite } from './graphic/sprite'
import { SpriteSheet } from './graphic/sprite-sheet'

/** Здесь находятся API для работы с канвой */
export class Display {
  /**
   * Конструктор
   * @param canvas ссылка на канву, которую определили ранее
   */
  constructor(canvas) {
    /**
     * Буффер (еще одна канва), где мы будет накидывать все что нужно отрисовать в текущем кадре,
     * а потом от туда переносить на основной экран
     */
    this.buffer = document.createElement('canvas').getContext('2d')
    this.context = canvas.getContext('2d')
    this.images = []
    this.camera = null

    this.isDebug = false
  }

  /** Массив подгруженных ресурсов (тайловые карты персонажей и т.д.) */
  setImages(images) {
    this.images = images
  }

  /** Чтение картинки по имени */
  getImage(name) {
    return this.images[name]
  }

  /** Установка камеры */
  setCamera(camera) {
    this.camera = camera
  }

  __createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas.getContext('2d')
  }

  createMap(name, mapData, tileSet) {
    const spriteSheet = new SpriteSheet(tileSet)
    const { tilewidth: spriteWidth, tileheight: spriteHeight } = mapData
    const context = this.__createCanvas(
      mapData.width * spriteWidth,
      mapData.height * spriteHeight)

    let row, col
    mapData.layers.filter(({ type }) => type === 'tilelayer').forEach(layer => {
      row = 0
      col = 0
      layer.data.forEach(index => {
        if (index) {
          context.drawImage(
            this.images[tileSet.name],
            spriteSheet.getSourceX(index),
            spriteSheet.getSourceY(index),
            spriteWidth,
            spriteHeight,
            col * spriteWidth,
            row * spriteHeight,
            spriteWidth,
            spriteHeight
          )
        }
        col ++
        if (col > (mapData.width - 1)) {
          col = 0
          row ++
        }
      })
    })

    const { canvas } = context
    this.images[name] = canvas

    return new Sprite({
      name,
      sourceX: 0,
      sourceY: 0,
      width: canvas.width,
      height: canvas.height,
    })
  }

  /**
   * Функция для проверки, нужно ли по заданным координатам рисовать объект.
   * Если он полностью выходит за рамки экрана, то рисовать нет смысла
   * */
  isNeedToDraw(x, y, width, height) {
    return !((x >= this.context.canvas.width) ||
      (y >= this.context.canvas.height) ||
      ((x + width) <= 0) ||
      ((y + height) <= 0))
  }

  /** Масштабируем канву */
  resize(width, height, heightWidthRatio) {
    if (height / width > heightWidthRatio) {
      this.context.canvas.height = width * heightWidthRatio
      this.context.canvas.width = width
    } else {
      this.context.canvas.height = height
      this.context.canvas.width = height / heightWidthRatio
    }

    // Флаг сглаживания отрисовки
    this.context.imageSmoothingEnabled = false
  }

  /** Отрисовка массива объектов статичной анимации */
  drawStaticAnimation(staticAnimation) {
    staticAnimation.objects.forEach(object => {
      this.drawSprite(object.animation)
    })
  }

  /**
   * Отрисовка параллакса, где учитывается Y позиция камеры для создания эффекта "когда игрок поднимается вверх,
   * то ближний фон уходит вниз (попадает из виду)"
   * @param parallaxImage параллакс
   * @param sticky флаг, что объект должен "прилипнуть" к заданной точке,
   * иначе он будет рисоваться относительно Y позиции камеры*/
  drawParallaxImage(parallaxImage, sticky = true) {
    parallaxImage.images.forEach(img => {
      let destinationY = Math.round(img.y)

      if (!sticky && this.camera) {
        destinationY -= this.camera.y
      }

      this.drawImg({ ...img, y: destinationY })
    })
  }

  /** Отрисовка обычной картинки с проверкой */
  drawImg(img) {
    if (!this.isNeedToDraw(img)) {
      return
    }

    this.buffer.drawImage(
      this.getImage(img.name),
      img.x,
      img.y,
      img.width,
      img.height)
  }

  /**
   * Отрисовка спрайта из заданной тайловой карты
   * @param sprite спрайт с набором параметров {@link Sprite}
   * @param props дополнительные пропсы
   * {
   *  width: number (ширина картинки, т.к. он может отличаться от размера спрайта)
   *  height: number (высота картинки, т.к. она может отличаться от размера спрайта)
   *  offsetX: number (смещение по X координате)
   *  offsetY: number (смещение по Y координате)
   * }
   * */
  drawSprite(sprite, props) {
    const { width, height, offsetX = 0, offsetY = 0 } = props ?? {}

    // x и y координаты берем как есть
    let destinationX = Math.round(sprite.x)
    let destinationY = Math.round(sprite.y)
    // width и height берем следующим приоритетом: пропсы -> размер картинки
    let destinationWidth = width || sprite.imageWidth || sprite.width
    let destinationHeight = height || sprite.imageHeight || sprite.height

    if (!this.isNeedToDraw({
      x: destinationX,
      y: destinationY,
      width: destinationWidth,
      height: destinationHeight
    })) {
      // Если объект не в зоне видимости, то выходим
      return
    }

    // Добавляем смещение по X и Y координате
    destinationX += offsetX
    destinationY += offsetY
    // А если смещение задано, то увеличиваем ширину и высоту
    destinationWidth += (Math.abs(offsetX) * 2)
    destinationHeight += (Math.abs(offsetY) * 2)

    if (this.camera) {
      // Если установлена камера, то корректируем X и Y координаты относительно её
      destinationX -= this.camera.x
      destinationY -= this.camera.y
    }

    if (sprite.flipped) {
      // Если установлен флаг, что нужно повернуть спрайт
      this.buffer.save()

      this.buffer.translate(destinationX + destinationWidth, 0)
      this.buffer.scale(-1, 1)

      this.buffer.drawImage(
        this.getImage(sprite.name),
        sprite.sourceX,
        sprite.sourceY,
        sprite.width,
        sprite.height,
        0,
        destinationY,
        destinationWidth,
        destinationHeight)

      this.buffer.restore()
    } else {
      // Рисуем как обычно

      this.buffer.drawImage(
        this.getImage(sprite.name),
        sprite.sourceX,
        sprite.sourceY,
        sprite.width,
        sprite.height,
        destinationX,
        destinationY,
        destinationWidth,
        destinationHeight)
    }

    if (this.isDebug) {
      // Если включена отладка, то дополнительно рисуем рамку вокруг спрайта
      this.buffer.strokeStyle = 'black'
      this.buffer.strokeRect(destinationX, destinationY, destinationWidth, destinationHeight)
    }
  }

  /**
   * Отрисовка рамки по заданным координатам и цветом.
   * @param sticky если true, то будет не учитываться позиция камеры
   * @param lineWidth ширина линии
   * */
  drawStroke({ x, y, width, height, color = 'black', lineWidth = 1, sticky = false }) {
    let destinationX = Math.round(x)
    let destinationY = Math.round(y)
    let destinationWidth = width
    let destinationHeight = height

    if (!this.isNeedToDraw({
      x: destinationX,
      y: destinationY,
      width: destinationWidth,
      height: destinationHeight
    })) {
      // Если объект не в зоне видимости, то выходим
      return
    }

    if (!sticky && this.camera) {
      destinationX -= this.camera.x
      destinationY -= this.camera.y
    }

    this.buffer.strokeStyle = color
    this.buffer.lineWidth = lineWidth
    this.buffer.strokeRect(destinationX, destinationY, destinationWidth, destinationHeight)
  }

  drawText({ text, x, y, sticky = false }) {
    let destinationX = Math.round(x)
    let destinationY = Math.round(y)

    if (!sticky && this.camera) {
      destinationX -= this.camera.x
      destinationY -= this.camera.y
    }

    this.buffer.font = "8px serif"
    this.buffer.fillStyle = 'black'
    this.buffer.fillText(text, destinationX, destinationY)
  }

  /** Заполнение канвы указанным цветом */
  fill(color) {
    this.buffer.fillStyle = color
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
  }

  /** Отрисовка основной канвы, где в качестве изображения передаем буффер. */
  render() {
    this.context.drawImage(
      this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height)
  }

  /** Рисуем сетку уровня */
  drawMapGrid(tileMap, map) {
    const { columns, size } = tileMap
    const { width, height } = size

    let x = 0
    let y = 0

    map.forEach((value, index) => {
      this.drawStroke({ x, y, width, height, color: 'yellow', lineWidth: 0.05 })
      this.drawText({ text: `${index}`, x: x + 2, y: y + 8 })
      x += width
      if ((index + 1) % columns === 0) {
        x = 0
        y += height
      }
    })
  }
}