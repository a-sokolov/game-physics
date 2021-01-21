import { Screen } from './screen'
import { Controller } from './controller'

import { CirclesScene } from './scenes/circles-scene'
import { MovementScene } from './scenes/movement-scene'

const CANVAS = {
  width: 300,
  height: 180
}

export class Game {
  constructor() {
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.controller = new Controller()
    this.scene = new MovementScene(this)
  }

  frame(time) {
    this.screen.fill('black')
    this.scene.render(time)

    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    this.scene.init()
    requestAnimationFrame(time => this.frame(time))
  }
}