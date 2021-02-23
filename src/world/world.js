import { NinjaAnimation } from './animation/ninja-animation'
import { NinjaController } from './controllers/ninja-controller'

import { ObjectsFactory } from './objects/objects-factory'
import { CollideObject } from './collide-object'

import { Level01 } from './levels/level-01'

import { CheckCoins } from './checks/check-coins'
import { CheckHMovingObjects } from './checks/check-hmoving-objects'

import { Environment } from './environment'
import { NINJA_TILES, NINJA_BOW_TILES, NINJA_SWORD_RUN_TILES } from './constants'

export class World {
  constructor(friction = 0.85, gravity = 2) {
    // Цвет фона
    this.backgroundColor = 'grey'

    // Создаем фабрику объектов
    this.objectFactory = new ObjectsFactory()

    // Создаем простой уровень
    this.level = new Level01()

    this.env = new Environment(friction, gravity, this.level.limitRect)
    this.player = this.objectFactory.createPlayer(this.level.playerPosition.x, this.level.playerPosition.y)
    this.playerAnimation = new NinjaAnimation({
      main: NINJA_TILES,
      bow: NINJA_BOW_TILES,
      sword: NINJA_SWORD_RUN_TILES
    })

    this.env.addMob(this.player)
    this.playerAnimation.watch(this.player)

    this.collider = new CollideObject()
    this.collider.setLevel(this.level)
    this.env.setCollider(this.collider)

    this.checkFireballs = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      callback: this.objectFactory.createFireBall
    })

    this.checkArrows = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      callback: this.objectFactory.createArrow
    })

    this.player.castAction.callback = this.checkFireballs.fire.bind(this.checkFireballs)
    this.player.bowAttackAction.callback = this.checkArrows.fire.bind(this.checkArrows)

    this.checkCoins = new CheckCoins(this.player, this.level.coinsStaticAnimation)
  }

  getPlayerController(controller) {
    this.playerAnimation.controller = controller
    return new NinjaController(this.player, controller)
  }

  update() {
    this.env.update()
    this.checkFireballs.update()
    this.checkArrows.update()
    this.level.update()
    this.playerAnimation.update()

    this.level.collisionRects = this.env.getAllCollisionRects()
      .concat(this.checkFireballs.objects.map(object => {
          return this.collider.getCollisionRects(object, true)
        }).flat())
      .concat(this.checkArrows.objects.map(object => {
          return this.collider.getCollisionRects(object, true)
        }).flat())
    this.checkCoins.update(this.env.getMobCollisionRects(this.player))
  }
}