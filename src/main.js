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

    this.tools.watch(this.game.world.player)

    window.addEventListener('resize', this.resize)
    window.addEventListener('keydown', this.keyDownUp)
    window.addEventListener('keyup', this.keyDownUp)

    // Грузим все ресурсы
    const imageLoader = new ImageLoader(ASSETS)
    imageLoader.load().then(() => {
      // Когда загрузили, то стартуем движок
      this.display.setImages(imageLoader.images)
      // Подгружаем уровень
      this.createLevelSprite()

      this.resize()
      this.engine.start()
    })
  }

  createLevelSprite() {
    const { key, map, spriteSheet, limitRect, cameraTrap, screenRect } = this.game.world.level
    const levelMap = {
      width: map.width,
      height: map.height,
      spriteWidth: map.tilewidth,
      spriteHeight: map.tileheight
    }
    this.game.world.level.levelSprite = this.display.createMap(
      key,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name !== 'before-layer'
        })
      }, spriteSheet)

    this.game.world.level.beforeSprite = this.display.createMap(
      `${key}-before-sprite`,
      {
        ...levelMap,
        layers: map.layers.filter(({ name, type }) => {
          return type === 'tilelayer' && name === 'before-layer'
        })
      }, spriteSheet)
    // Создаем нужные спрайты уровня
    this.game.world.level.createImages(this.display)

    // Устанавливаем размер канвы
    this.display.buffer.canvas.width = screenRect.width
    this.display.buffer.canvas.height = screenRect.height

    this.camera = new MainCamera({
      edgeRect: cameraTrap,
      limitRect,
      screenRect
    })
    this.camera.watch(this.game.world.player)
    // Устанавливаем камеру (сейчас это прямоугольник, который игрок двигает вперед/назад)
    this.display.setCamera(this.camera)
  }

  keyDownUp(event) {
    this.controller.keyDownUp(event.type, event.keyCode)
  }

  resize() {
    const { screenRect } = this.game.world.level
    this.display.resize(
      document.documentElement.clientWidth - 32,
      document.documentElement.clientHeight - 32,
      screenRect.height / screenRect.width)
    this.display.render()
  }

  /**
   * Здесь происходит отрисовка (рендер) всех объектов игры
   * TODO: надо сделать так, чтобы не руками добавлять, а где-то регистрировать объект
   */
  render() {
    // Цвет фона
    this.display.fill(this.game.world.backgroundColor)
    // Рисуем все что до карты уровня
    this.game.world.level.images.forEach(image => this.display.drawImg(image))
    // Рисуем карту уровня
    this.display.drawSprite(this.game.world.level.levelSprite)
    // Рисуем всю статичную анимацию (сейчас это монетки)
    this.game.world.level.staticAnimations.forEach(staticAnimation => {
      this.display.drawStaticAnimation(staticAnimation)
    })

    // Рисуем анимацию игрока со смещение в 0.5 пикселя, чтобы визуально он стоял на плитке, а не нависал над ней
    this.display.drawSprite(this.game.world.playerAnimation.animation)

    // Рисуем все снаряды, которые находятся на экране
    const { checkFireballs, checkArrows } = this.game.world
    checkFireballs.objects.concat(checkArrows.objects).forEach(object => {
      const { width, height } = object
      this.display.drawSprite(object.ref.animation, { width, height })
    })

    // Рисуем, что должно быть поверх всего
    this.display.drawSprite(this.game.world.level.beforeSprite)

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