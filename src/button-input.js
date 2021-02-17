/** Класс, где храним флаги нажатия/отжатия, активности клавиши */
export class ButtonInput {
  constructor() {
    this.down = false
    this.active = false
  }

  getInput(down) {
    if (this.down !== down) {
      this.active = down
    }
    this.down = down
  }
}