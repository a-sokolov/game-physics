/**
 * Набор инструментов для отладки.
 * Сейчас только чек-бокс "Debug", который вкл/откл рамки вокруг всех объектов и коллизий
 * */
export class Tools {
  constructor(main) {
    this.main = main
    this.isDebug = false
    this.isShowGrid = false
    this.player = null

    this.debugInfo = document.getElementById('debug-info')

    this.handleDebugClick = this.handleDebugClick.bind(this)
    this.handleGridClick = this.handleGridClick.bind(this)
    this.handleStopSlick = this.handleStopSlick.bind(this)

    const debugCheckbox = document.getElementById('debug')
    debugCheckbox.addEventListener('click', this.handleDebugClick)

    const gridCheckbox = document.getElementById('grid')
    gridCheckbox.addEventListener('click', this.handleGridClick)

    const stopCheckbox = document.getElementById('stop')
    stopCheckbox.addEventListener('click', this.handleStopSlick)
  }

  watch(player) {
    this.player = player
  }

  handleDebugClick(event) {
    this.isDebug = event.target.checked
    this.main.display.isDebug = this.isDebug
  }

  handleGridClick(event) {
    this.isShowGrid = event.target.checked
  }

  handleStopSlick(event) {
    if (event.target.checked) {
      this.main.engine.stop()
    } else {
      this.main.engine.start()
    }
  }

  update() {
    if (this.player) {
      const { x, y , width, height } = this.player
      this.debugInfo.value = `${Math.round(x)}:${Math.round(y)} ${width}:${height}`
    }
  }
}