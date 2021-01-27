import { Engine } from './engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'

export class Main {
  constructor() {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')

    let canvas
    if (elements.length) {
      // Если нашли ранее созданный, то возвращаем его
      canvas = elements[0]
    } else {
      canvas = document.createElement('canvas')
      root.appendChild(canvas)
    }

    this.controller = new Controller()
    this.display = new Display(canvas)
    this.game = new Game()

    this.render = this.render.bind(this)
    this.update = this.update.bind(this)
    this.engine = new Engine(1000 / 30, this.render, this.update)

    window.addEventListener('resize', this.display.handleResize)
    window.addEventListener('keydown', this.controller.handleKeyDownUp)
    window.addEventListener('keyup', this.controller.handleKeyDownUp)

    this.display.resize()
    this.engine.start()
  }

  render() {
    this.display.renderColor(this.game.color)
    this.display.render()
  }

  update() {
    this.game.update()
  }
}