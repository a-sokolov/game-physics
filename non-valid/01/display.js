export class Display {
  constructor(canvas) {
    // Буффер изображений
    this.buffer = document.createElement('canvas').getContext('2d')
    // Основной контекст
    this.context = canvas.getContext('2d')

    this.handleResize = this.handleResize.bind(this)
  }

  resize(event) {
    let height, width

    height = document.documentElement.clientHeight
    width  = document.documentElement.clientWidth

    this.context.canvas.height = height - 32
    this.context.canvas.width = width - 32

    this.render()
  }

  handleResize(event) {
    this.resize(event)
  }

  renderColor(color) {
    this.buffer.fillStyle = color
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
  }

  render() {
    this.context.drawImage(this.buffer.canvas,
      0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
      0, 0, this.context.canvas.width, this.context.canvas.height)
  }
}