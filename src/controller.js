import { ButtonInput } from './button-input'

/** Контроллер, который слушает ввод */
export class Controller {
  constructor() {
    this.down = new ButtonInput()
    this.left = new ButtonInput()
    this.right = new ButtonInput()
    this.up = new ButtonInput()
    this.jump = new ButtonInput()
    this.fire = new ButtonInput()
    this.altFire = new ButtonInput()
  }

  keyDownUp(type, keyCode) {
    const down = (type === "keydown")

    switch(keyCode) {
      case 37: // Стрелка влево
        this.left.getInput(down)
        break
      case 38: // Стрелка вверх
        this.up.getInput(down)
        break
      case 39: // Стрелка вправо
        this.right.getInput(down)
        break
      case 40: // Стрелка вниз
        this.down.getInput(down)
        break
      case 32: // Пробел
        this.jump.getInput(down)
        break
      case 70: // Клавиша F
        this.fire.getInput(down)
        break
      case 82: // Клавиша R
        this.altFire.getInput(down)
        break
    }
  }
}