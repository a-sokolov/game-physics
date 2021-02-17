import { Engine } from '../engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'
import { Tools } from './tools';

import { ImageLoader } from './loaders/image-loader'

/**
 * Основной класс, который грузит ресурсы и управляет:
 * - игрой (где описывается логика и физика игры)
 * - дисплеем (наша канва)
 * - движком (запуск update/render функций)
 * - контроллером (нажатие клавиш)
 * */
export class Main {
  /**
   * Конструктор
   * @param timeStep - кол-во кадров в секунду (сейчас это 1000 / 30)
   * */
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

    this.tools = new Tools(this)

    this.controller = new Controller()
    this.display = new Display(canvas)
    this.game = new Game()
    this.engine = new Engine(timeStep, this.render, this.update)

    // Устанавливаем камеру (сейчас это прямоугольник, который игрок двигает вперед/назад)
    this.display.setCamera(this.game.world.camera)

    window.addEventListener('resize', this.resize)
    window.addEventListener('keydown', this.keyDownUp)
    window.addEventListener('keyup', this.keyDownUp)

    // Устанавливаем размер канвы
    this.display.buffer.canvas.height = this.game.world.height
    this.display.buffer.canvas.width = this.game.world.width

    // Грузим все ресурсы
    const imageLoader = new ImageLoader({
      'rick-tiles': './assets/rick/rick_tiles.png',
      'morty-tiles': './assets/morty/morty_tiles.png',
      'jerry-tiles': './assets/morty/morty_tiles.png',
      'far-ground': './assets/background/sky-background/parallax_parts/mountains/farground_mountains.png',
      'mid-ground': './assets/background/sky-background/parallax_parts/mountains/midground_mountains.png',
      'foreground': './assets/background/sky-background/parallax_parts/mountain_with_hills/foreground_mountains.png',
      'sun': './assets/background/sky-background/parallax_parts/sun.png',
      'mid-cloud1': './assets/background/sky-background/parallax_parts/mid_ground_cloud_1.png',
      'mid-cloud2': './assets/background/sky-background/parallax_parts/mid_ground_cloud_2.png',
      'brick': './assets/level01/brick.png',
      'red-fire-ball-tiles': './assets/fireball/red_fire_balls.png',
      'coin-tiles': './assets/coin-tiles.png',
      'ninja-tiles': './assets/ninja-tiles.png'
    })

    imageLoader.load().then(() => {
      // Когда загрузили, то стартуем движок
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

  /**
   * Здесь происходит отрисовка (рендер) всех объектов игры
   * TODO: надо сделать так, чтобы не руками добавлять, а где-то регистрировать объект
   */
  render() {
    // Цвет фона
    this.display.fill(this.game.world.backgroundColor)
    // Рисуем солнце
    this.display.drawImg(this.game.world.background.sun)
    // Рисуем параллакс для облаков дальних
    this.display.drawParallaxImage(this.game.world.background.cloud1)
    // Рисуем параллакс для облаков передних
    this.display.drawParallaxImage(this.game.world.background.cloud2)

    // Рисуем параллакс для бэкграунда
    this.game.world.background.images.forEach(image => {
      this.display.drawParallaxImage(image, image.sticky)
    })

    // Рисуем карту уровня
    this.display.drawMapSprites(this.game.world.level.mapSprites)
    // Рисуем всю статичную анимацию (сейчас это монетки)
    this.game.world.level.staticAnimations.forEach(staticAnimation => {
      this.display.drawStaticAnimation(staticAnimation)
    })

    // Рисуем анимацию игрока со смещение в 0.5 пикселя, чтобы визуально он стоял на плитке, а не нависал над ней
    this.display.drawSprite(
      this.game.world.playerAnimation.animation,
      {
        width: this.game.world.player.width,
        height: this.game.world.player.height,
        offsetX: 0.5,
        offsetY: 0.5
      }
    )

    // Рисуем единственного противника, Jerry из Rick&Morty (попытка написания простого AI)
    this.display.drawSprite(
      this.game.world.jerryAnimation.animation,
      {
        width: this.game.world.jerry.width,
        height: this.game.world.jerry.height,
        offsetX: 0.5,
        offsetY: 0.5
      }
    )

    // Рисуем все файеры, которые находятся на экране
    this.game.world.checkFireballs.fireBallsAnimation.forEach(fireBallAnimation => {
      const { width, height } = fireBallAnimation.fireBall
      this.display.drawSprite(fireBallAnimation.animation, { width, height })
    })

    // Если в режиме "Debug"
    if (this.tools.isDebug) {
      // Рисуем все коллизии красным цветом
      this.game.world.level.collisionRects.forEach(rect => {
        this.display.drawStroke({ ...rect, color: 'red' })
      })

      // Рисуем границы камеры игрока, заданным цветом
      this.game.world.camera.rects.forEach((({ rect, color, sticky }) => {
        this.display.drawStroke({ ...rect, color, sticky })
      }))
    }

    // Выводим на экран
    this.display.render()
  }

  // Здесь обновляем позиции объектов и "слушаем" ввод с клавиатуры
  update(time) {
    // Флаг "игрок присел"
    this.game.world.player.crouch(this.controller.down.active)

    // Движение влево
    if (this.controller.left.active)  {
      this.game.world.player.moveLeft()
    }
    // Движение вправо
    if (this.controller.right.active) {
      this.game.world.player.moveRight()
    }
    // Прыжок (после, сразу деактивируем нажатие, чтобы убрать эффект "прыгаем пока зажата клавиша")
    if (this.controller.jump.active) {
      this.game.world.player.jump()
      this.controller.jump.active = false
    }
    // Швыряем файер (также деактивируем нажатие)
    if (this.controller.fire.active) {
      this.game.world.fire()
      this.controller.fire.active = false
    }
    // Удар мечом (также деактивируем нажатие)
    if (this.controller.altFire.active) {
      this.game.world.player.fire()
      this.controller.altFire.active = false
    }

    // Обновляем объекты самой игры
    this.game.update(time)
  }
}