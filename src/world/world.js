import { NinjaAnimation } from './animation/ninja-animation'
import { NinjaController } from './controllers/ninja-controller'

import { ObjectsFactory } from './objects/objects-factory'
import { CollideObject } from './collide-object'

import { Level01 } from './levels/level-01'
import { Level02 } from './levels/level-02'

import { CheckCoins } from './checks/check-coins'
import { CheckHMovingObjects } from './checks/check-hmoving-objects'

import { Environment } from './environment'
import { TilesetSpriteSheet } from '../graphic/tileset-sprite-sheet'
import { Resources } from '../resources'
import { checkRectCollision } from '../utils'

const NINJA_TILES = Resources.getSprite('ninja-tiles')
const NINJA_BOW_TILES = Resources.getSprite('ninja-bow-tiles')
const NINJA_SWORD_RUN_TILES = Resources.getSprite('ninja-sword-run-tiles')

export class World {
  constructor({ friction = 0.85, gravity = 2, createLevel }) {
    // Цвет фона
    this.backgroundColor = 'grey'
    this.createLevel = createLevel

    this.collider = new CollideObject()
    this.env = new Environment(friction, gravity, this.collider)
    // Анимация игрока
    this.playerAnimation = new NinjaAnimation({
      main: new TilesetSpriteSheet(NINJA_TILES, require('../assets/ninja.json')),
      bow: new TilesetSpriteSheet(NINJA_BOW_TILES, require('../assets/ninja-bow.json')),
      sword: new TilesetSpriteSheet(NINJA_SWORD_RUN_TILES, require('../assets/ninja-sword.json'))
    })
  }

  setLevel(level) {
    switch (level) {
      case '01':
        this.level = new Level01()
        break
      case '02':
        this.level = new Level02()
        break
      default:
        throw new Error(`Unsupported level value ${level}`)
    }

    this.initLevel()
  }

  initLevel() {
    this.player = ObjectsFactory.createPlayer(this.level.playerPosition.x, this.level.playerPosition.y)
    this.collider.setLevel(this.level)

    this.env.init(this.level.limitRect)
    this.env.addMob(this.player)
    this.playerAnimation.watch(this.player)
    this.level.watch(this.player)

    this.checkFireballs = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      callback: ObjectsFactory.createFireBall
    })

    this.checkArrows = new CheckHMovingObjects({
      player: this.player,
      limitRect: this.level.limitRect,
      callback: ObjectsFactory.createArrow
    })

    this.player.castAction.callback = this.checkFireballs.fire.bind(this.checkFireballs)
    this.player.bowAttackAction.callback = this.checkArrows.fire.bind(this.checkArrows)
    this.checkCoins = new CheckCoins(this.player, this.level.coinsStaticAnimation)
  }

  getPlayerController(controller) {
    this.playerAnimation.controller = controller
    return new NinjaController(controller)
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

    if (this.level.nextLevelGate) {
      if (checkRectCollision(this.player, this.level.nextLevelGate)) {
        this.createLevel(this.level.nextLevel)
      }
    }

    // if (this.level.prevLevelGate) {
    //   if (checkRectCollision(this.player, this.level.prevLevelGate)) {
    //     this.createLevel(this.level.prevLevel)
    //   }
    // }
  }
}