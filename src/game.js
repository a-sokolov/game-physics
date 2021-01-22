import { Screen } from './screen'
import { Controller } from './controller'
import { MovementScene } from './scenes/movement-scene'

const CANVAS = {
  width: 400,
  height: 400
}

export class Game {
  constructor() {
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.screen.loadSpriteSheet('rick-tiles', './assets/rick/rick_tiles.png').then(() => {
      console.log('Bingo')
      this.scene = new MovementScene(this)
      this.scene.init()
    })
    this.controller = new Controller()
  }

  frame(time) {
    this.screen.fill('orange')
    this.scene?.render(time)

    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    requestAnimationFrame(time => this.frame(time))
  }
}