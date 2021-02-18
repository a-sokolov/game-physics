// import { Background } from './objects/background'
import { ObjectsFactory } from './objects/objects-factory'

import { MobAnimation } from './animation/mob-animation'
import { NinjaAnimation } from './animation/ninja-animation'
// import { BackgroundAnimation } from './animation/background-animation'

import { CollideObject } from './collide-object'

import { Rect } from '../base/rect'

import { Level01 } from './levels/level-01'
import { CheckCoins } from './checks/check-coins'
import { CheckFireballs } from './checks/check-fireballs'

import { Environment } from './environment'
// import { DummyBehavior } from './npc/dummy-behavior'
import { NINJA_TILES, JERRY_TILES } from './constants'

export class World {
  constructor(friction = 0.85, gravity = 2) {
    // Цвет фона
    this.backgroundColor = 'grey'
    // Ширина и высота экрана
    this.width = 320
    this.height = 160
    // Базовый размер спрайта - он нужен чтобы строить карту и считать коллизии
    this.spriteSize = {
      width: 16,
      height: 16
    }

    // Прямоугольник, который определяет границы когда нужно двигать камеру
    this.edgeRect = new Rect(100, 0, this.width / 2 - 100, this.height)
    // Размер экрана
    this.screenRect = new Rect(0, 0, this.width, this.height)

    // Создаем простой уровень
    this.level = new Level01(this.spriteSize, this.width, this.height)

    this.env = new Environment(friction, gravity, this.level.limitRect)
    this.player = ObjectsFactory.createPlayer(10, 100)
    this.playerAnimation = new NinjaAnimation(NINJA_TILES)

    this.checkFireballs = new CheckFireballs(this.player, this.level.limitRect)

    // this.jerry = ObjectsFactory.createJerry(50, 100)
    // this.jerryAnimation = new MobAnimation(JERRY_TILES)
    //
    // this.jerryBehavior = new DummyBehavior(this.jerry, this.player, this.screenRect, this.limitRect)

    this.env.addMob(this.player) //, this.jerry

    // this.background = new Background(this.screenRect, this.player.speed)

    // this.backgroundAnimation = new BackgroundAnimation({
    //   background: this.background,
    //   camera: this.camera,
    //   edgeRect: this.edgeRect,
    //   screenRect: this.screenRect,
    //   limitRect: this.limitRect
    // })

    this.playerAnimation.watch(this.player)
    // this.jerryAnimation.watch(this.jerry)
    // this.backgroundAnimation.watch(this.player)

    this.collider = new CollideObject()
    this.collider.setLevel(this.level)
    this.env.setCollider(this.collider)

    this.checkCoins = new CheckCoins(this.player, this.level.coinsStaticAnimation)
  }

  fire() {
    this.checkFireballs.fire()
  }

  update() {
    this.env.update()
    // this.jerryBehavior.update()
    this.checkFireballs.update()
    this.level.staticAnimations.forEach(staticAnimation => staticAnimation.update())

    this.playerAnimation.update()
    // this.jerryAnimation.update()
    // this.backgroundAnimation.update()

    this.level.collisionRects = this.env.getAllCollisionRects().concat(
        this.checkFireballs.fireBallsAnimation.map(({ fireBall }) => {
          return this.collider.getCollisionRects(fireBall)
        }).flat())
    this.checkCoins.update(this.env.getMobCollisionRects(this.player))
  }
}