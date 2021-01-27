import { Engine } from '../engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'

import { ImageLoader } from './loaders/image-loader'

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
    this.display = new Display(canvas)
    this.game = new Game()
    this.engine = new Engine(timeStep, this.render, this.update)

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

    imageLoader.load().then(images => {
      this.display.setImages(images)
      this.resize()
      this.engine.start()
    })
  }

  keyDownUp(event) {
    this.controller.keyDownUp(event.type, event.keyCode)
  }

  resize(event) {
    this.display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      this.game.world.height / this.game.world.width)
    this.display.render()
  }

  render() {
    this.display.fill(this.game.world.backgroundColor)
    this.display.drawPlayer(this.game.world.player, this.game.world.player.color1, this.game.world.player.color2)
    this.display.render()
  }

  update() {
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

    this.game.update()
  }
}