export class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = this.createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
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
}