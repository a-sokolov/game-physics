export class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = this.createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
    this.images = []
  }

  createCanvas(width, height) {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')
    if (elements.length) {
      // Если нашли ранее созданный, то возвращаем его
      return elements[0]
    }

    // Создаем "холст" и инициализируем его
    const canvas = document.createElement('canvas')
    root.appendChild(canvas)

    canvas.width = width
    canvas.height = height

    return canvas
  }

  loadSpriteSheet(name, src) {
    return new Promise(resolve => {
      const image = new Image()
      this.images[name] = image
      image.src = src
      image.onload = () => resolve(name)
    })
  }

  drawSprite(sprite, width, height) {
    const image = this.images[sprite.imageName]
    this.context.drawImage(image,
      sprite.sourceX,
      sprite.sourceY,
      sprite.width,
      sprite.height,
      sprite.x,
      sprite.y,
      width || sprite.width,
      height || sprite.height)
  }

  fill(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.width, this.height)
  }

  drawCircle(circle, color) {
    this.context.fillStyle = color
    this.context.beginPath()
    this.context.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, false)
    this.context.closePath()
    this.context.fill()
  }

  drawRect(rect, color) {
    this.context.fillStyle = color
    this.context.fillRect(rect.position.x, rect.position.y, rect.width, rect.height)
  }
}