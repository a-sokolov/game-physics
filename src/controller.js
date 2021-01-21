export class Controller {
  constructor() {
    this.left = false
    this.right = false
    this.up = false
    this.down = false
    this.jump = false

    this.keyMap = new Map([
      [37, 'left'],
      [39, 'right'],
      [38, 'up'],
      [40, 'down'],
      [32, 'jump'],
    ])

    document.addEventListener('keydown', event => this.update(event, true))
    document.addEventListener('keyup', event => this.update(event, false))
  }

  update(event, pressed) {
    if (this.keyMap.has(event.keyCode)) {
      event.preventDefault()
      event.stopPropagation()

      const key = this.keyMap.get(event.keyCode)
      this[key] = pressed
    }
  }
}