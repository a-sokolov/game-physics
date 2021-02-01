import { ButtonInput } from './button-input'

export class Controller {
  constructor() {
    this.down = new ButtonInput()
    this.left = new ButtonInput()
    this.right = new ButtonInput()
    this.up = new ButtonInput()
    this.jump = new ButtonInput()
    this.fire = new ButtonInput()
  }

  keyDownUp(type, keyCode) {
    const down = (type === "keydown")

    switch(keyCode) {
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
        break
      case 70:
        this.fire.getInput(down)
        break
    }
  }
}