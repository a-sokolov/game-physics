import { ButtonInput } from './button-input'

export class Controller {
  constructor() {
    this.down = new ButtonInput()
    this.left = new ButtonInput()
    this.right = new ButtonInput()
    this.up = new ButtonInput()
    this.jump = new ButtonInput()

    this.handleKeyDownUp = this.handleKeyDownUp.bind(this)
  }

  keyDownUp(event) {
    const down = (event.type === "keydown")

    switch(event.keyCode) {
      case 37:
        this.left.getInput(down)
        break
      case 38:
        this.up.getInput(down)
        break
      case 39:
        this.right.getInput(down)
        break
      case 40:
        this.down.getInput(down)
        break
      case 32:
        this.jump.getInput(down)
    }
  }

  handleKeyDownUp(event) {
    this.keyDownUp(event)
  }
}