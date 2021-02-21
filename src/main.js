import { Engine } from './engine'
import { Display } from './display'
import { Controller } from './controller'
import { Game } from './game'
import { MainCamera } from './main-camera'
import { Tools } from './tools';

import { ImageLoader } from './loaders/image-loader'

import { ASSETS } from './constants'

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
    this.engine = new Engine(timeStep, this.update, this.render)
    this.playerController = this.game.world.getPlayerController(this.controller)

    this.camera = new MainCamera({
      edgeRect: this.game.world.edgeRect,
      limitRect: this.game.world.level.limitRect,
      screenRect: this.game.world.screenRect
    })
    this.camera.watch(this.game.world.player)
    this.tools.watch(this.game.world.player)

    // Устанавливаем камеру (сейчас это прямоугольник, который игрок двигает вперед/назад)
    this.display.setCamera(this.camera)

    window.addEventListener('resize', this.resize)
    window.addEventListener('keydown', this.keyDownUp)
    window.addEventListener('keyup', this.keyDownUp)

    // Устанавливаем размер канвы
    this.display.buffer.canvas.height = this.game.world.height
    this.display.buffer.canvas.width = this.game.world.width

    // Грузим все ресурсы
    const imageLoader = new ImageLoader(ASSETS)
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

    // Рисуем карту уровня
    this.display.drawMapSprites(this.game.world.level.mapSprites)
    // Рисуем всю статичную анимацию (сейчас это монетки)
    this.game.world.level.staticAnimations.forEach(staticAnimation => {
      this.display.drawStaticAnimation(staticAnimation)
    })

    // Рисуем анимацию игрока со смещение в 0.5 пикселя, чтобы визуально он стоял на плитке, а не нависал над ней
    this.display.drawSprite(this.game.world.playerAnimation.animation)

    // Рисуем все файеры, которые находятся на экране
    this.game.world.checkFireballs.objects.forEach(fireball => {
      const { width, height } = fireball
      this.display.drawSprite(fireball.ref.animation, { width, height })
    })
    // Рисуем все стрелы, которые находятся на экране
    this.game.world.checkArrows.objects.forEach(arrow => {
      const { width, height } = arrow
      this.display.drawSprite(arrow.ref.animation, { width, height })
    })

    // Если в режиме "Debug"
    this.tools.render()
    // Выводим на экран
    this.display.render()
  }

  // Здесь обновляем позиции объектов и "слушаем" ввод с клавиатуры
  update(time) {
    // Слушаем ввод с клавиатуры
    this.playerController.update()
    // Обновляем объекты самой игры
    this.game.update(time)
    // Обновляем координаты камеры
    this.camera.update()
    // Обновляем отладочные инструменты
    this.tools.update()
  }
}