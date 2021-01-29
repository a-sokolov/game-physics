import { Engine } from '../engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'

import { ImageLoader } from './loaders/image-loader'

const DEBUG = true

export class Main {
  constructor(timeStep) {
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

    this.keyDownUp = this.keyDownUp.bind(this)
    this.resize = this.resize.bind(this)
    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.controller = new Controller()
    this.display = new Display(canvas, DEBUG)
    this.game = new Game()
    this.engine = new Engine(timeStep, this.render, this.update)

    this.display.setCamera(this.game.world.camera)

    window.addEventListener('resize', this.resize)
    window.addEventListener('keydown', this.keyDownUp)
    window.addEventListener('keyup', this.keyDownUp)

    this.display.buffer.canvas.height = this.game.world.height
    this.display.buffer.canvas.width = this.game.world.width

    const imageLoader = new ImageLoader({
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

    imageLoader.load().then(() => {
      this.display.setImages(imageLoader.images)
      this.resize()
      this.engine.start()
    })
  }

  keyDownUp(event) {
    this.controller.keyDownUp(event.type, event.keyCode)
  }

  resize() {
    this.display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      this.game.world.height / this.game.world.width)
    this.display.render()
  }

  render() {
    this.display.fill(this.game.world.backgroundColor)

    this.display.drawImg(this.game.world.background.sun)

    this.display.drawParallaxImage(this.game.world.background.cloud1)
    this.display.drawParallaxImage(this.game.world.background.cloud2)

    this.game.world.background.images.forEach(image => {
      this.display.drawParallaxImage(image, image.sticky)
    })

    this.display.drawMap(this.game.world.tileMap)

    // this.game.world.playerAnimation.animation.setXY(
    //   this.game.world.player.x,
    //   this.game.world.player.y)

    this.display.drawSprite(
      this.game.world.playerAnimation.animation,
      {
        width: this.game.world.player.width,
        height: this.game.world.player.height,
        // offsetX: 1,
        // offsetY: 1
      }
    )

    if (DEBUG) {
      this.game.world.collisionRects.forEach(rect => {
        this.display.drawStroke({ ...rect, color: 'red' })
      })

      this.game.world.camera.rects.forEach((({ rect, color, sticky }) => {
        this.display.drawStroke({ ...rect, color, sticky })
      }))
    }

    this.display.render()
  }

  update(time) {
    if (this.controller.left.active)  {
      this.game.world.player.moveLeft()
    }
    if (this.controller.right.active) {
      this.game.world.player.moveRight()
    }
    if (this.controller.jump.active) {
      this.game.world.player.jump()
      this.controller.jump.active = false
    }

    this.game.update(time)
  }
}