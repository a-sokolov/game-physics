import { Screen } from './screen'
import { CameraByRect } from './cameras/camera-by-rect'
import { BackgroundController } from './controllers/background-controller'
import { Player } from './player'

import { SPEED, CANVAS, RICK_TILES, GRAVITY, JUMP, FLOOR_Y } from './constants'

import { Background } from './background'
import { MovementScene } from './scenes/movement-scene'
import { Vector } from './vector'
import { Rect } from './shapes/rect'
import { Sprite } from './sprite'

// this.morty = new Player({
//   ...props,
//   tileProps: MORTY_TILES,
//   keymap: MORTY_KEYMAP,
//   position: new Vector(this.game.screen.width - MORTY_TILES.width - 30, 20)
// })

export class Game {
  constructor() {
    this.screen = new Screen(CANVAS.width, CANVAS.height)
    this.screen.loadImages({
      'rick-tiles': './assets/rick/rick_tiles.png',
      'morty-tiles': './assets/morty/morty_tiles.png',
      'far-ground': './assets/background/sky-background/parallax_parts/mountains/farground_mountains.png',
      'mid-ground': './assets/background/sky-background/parallax_parts/mountains/midground_mountains.png',
      'foreground': './assets/background/sky-background/parallax_parts/mountain_with_hills/foreground_mountains.png',
      'sun': './assets/background/sky-background/parallax_parts/sun.png',
      'mid-cloud1': './assets/background/sky-background/parallax_parts/mid_ground_cloud_1.png',
      'mid-cloud2': './assets/background/sky-background/parallax_parts/mid_ground_cloud_2.png',
      'brick': './assets/level01/brick.png'
    })

    const edgeRect = new Rect(
      100,
      this.screen.height / 2,
      this.screen.width / 2 - 100,
      this.screen.height / 2)
    const screenRect = new Rect(0, 0, this.screen.width, this.screen.height)
    const limitRect = new Rect(0, 0, this.screen.width * 3, this.screen.height)

    this.camera = new CameraByRect({
      screen: this.screen,
      screenRect, limitRect, edgeRect,
      scrollEdge: this.screen.width / 2
    })

    this.screen.setCamera(this.camera)

    const props = { game: this, speed: SPEED, gravity: GRAVITY, jump: JUMP }
    this.rick = new Player({
      ...props,
      tileProps: RICK_TILES,
      position: new Vector(30, this.screen.height - FLOOR_Y)
    })

    this.camera.watch(this.rick.rect)

    this.background = new Background(this.screen, SPEED)
    this.backgroundController = new BackgroundController({
      background: this.background,
      camera: this.camera,
      screenRect, limitRect, edgeRect
    })
    this.backgroundController.watch(this.rick.rect)
    this.isGameStarted = false
  }

  frame(time) {
    if (this.screen.isImagesLoaded && !this.isGameStarted) {
      this.isGameStarted = true
      this.scene = new MovementScene(this, this.rick)
      this.scene.init()

      this.bricks = []

      let startX = 500
      let startY = 400

      Array.from({ length: 30 }).forEach((value, index) => {
        this.bricks.push(new Sprite({ imageName: 'brick', x: startX, y: startY, width: 64, height: 64 }))

        startX += 64
        if (index > 0 && index % 10 === 0) {
          startY -= 64
        }
      })
    } else if (this.screen.isImagesLoaded) {
      this.screen.clear()
      this.screen.fill('orange')

      this.backgroundController.render(time)
      this.background.render(time)

      this.scene?.render(time)
      this.camera.render(time)

      this.bricks.forEach(brick => this.screen.drawSprite(brick))
    }

    requestAnimationFrame(time => this.frame(time))
  }

  run() {
    requestAnimationFrame(time => this.frame(time))
  }
}