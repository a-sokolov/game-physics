export class Tools {
  constructor(game) {
    this.game = game
    this.isDebug = false

    this.handleDebugClick = this.handleDebugClick.bind(this)

    const debugCheckbox = document.getElementById('debug')
    debugCheckbox.addEventListener('click', this.handleDebugClick)
  }

  handleDebugClick(event) {
    this.isDebug = event.target.checked
    this.game.display.isDebug = this.isDebug
  }
}