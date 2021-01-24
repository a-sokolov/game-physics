import { Screen } from './screen'
import { Camera } from './camera'
import { Player } from './player'

import { SPEED, CANVAS, RICK_TILES, GRAVITY, JUMP } from './constants'

import { Background } from './background'
import { MovementScene } from './scenes/movement-scene'
import { Vector } from './vector'

// this.morty = new Player({
//   ...props,
//   tileProps: MORTY_TILES,
//   keymap: MORTY_KEYMAP,
//   position: new Vector(this.game.screen.width - MORTY_TILES.width - 30, 20)
// })

export class Game {
  constructor() {
    const levelWidth = CANVAS.width * 2

    this.camera = new Camera(this, levelWidth, CANVAS.width / 2)
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.screen.loadImages({
      'rick-tiles': './assets/rick/rick_tiles.png',
      'morty-tiles': './assets/morty/morty_tiles.png',
      'far-ground': './assets/background/sky-background/parallax_parts/mountains/farground_mountains.png',
      'mid-ground': './assets/background/sky-background/parallax_parts/mountains/midground_mountains.png',
      'foreground': './assets/background/sky-background/parallax_parts/mountains/foreground_mountains.png',
      'sun': './assets/background/sky-background/parallax_parts/sun.png',
      'mid-cloud1': './assets/background/sky-background/parallax_parts/mid_ground_cloud_1.png',
      'mid-cloud2': './assets/background/sky-background/parallax_parts/mid_ground_cloud_2.png'
    })
    this.screen.setCamera(this.camera)

    const props = { game: this, screenWidth: levelWidth, speed: SPEED, gravity: GRAVITY, jump: JUMP }
    this.rick = new Player({
      ...props,
      tileProps: RICK_TILES,
      position: new Vector(30, 20)
    })

    this.camera.watch(this.rick.rect.mob)

    this.background = new Background(this.screen, SPEED)
    this.isGameStarted = false
  }

  frame(time) {
    if (this.screen.isImagesLoaded && !this.isGameStarted) {
      this.isGameStarted = true
      this.scene = new MovementScene(this, this.rick)
      this.scene.init()
    } else if (this.screen.isImagesLoaded) {
      this.screen.fill('#00D4FF')

      this.background.render(time)

      this.scene?.render(time)
      this.camera.render(time)
    }

    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    requestAnimationFrame(time => this.frame(time))
  }
}