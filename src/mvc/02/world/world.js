import { Background } from './objects/background'
import { ObjectsFactory } from './objects/objects-factory'

import { MobAnimation } from './animation/mob-animation'
import { BackgroundAnimation } from './animation/background-animation'

import { CollideObject } from './collide-object'

import { Rect } from '../base/rect'
import { MainCamera} from './main-camera'

import { Level01 } from './levels/level-01'
import { CheckCoins } from './checks/check-coins'
import { CheckFireballs } from './checks/check-fireballs'

import { Environment } from './environment'
import { DummyBehavior } from './npc/dummy-behavior'
import { NINJA_TILES, JERRY_TILES } from './constants'
import {NinjaAnimation} from "./animation/ninja-animation";

export class World {
  constructor(friction = 0.85, gravity = 2) {
    this.backgroundColor = 'orange'
    this.width = 1024
    this.height = 640
    this.spriteSize = {
      width: 64,
      height: 64
    }

    this.edgeRect = new Rect(300, this.height / 2, this.width / 2 - 300, this.height / 2)
    this.screenRect = new Rect(0, 0, this.width, this.height)
    this.limitRect = new Rect(0, 0, this.width * 2, this.height * 2)

    this.env = new Environment(friction, gravity, this.limitRect)
    this.player = ObjectsFactory.createRick(10, 500)
    this.playerAnimation = new NinjaAnimation(NINJA_TILES)

    this.checkFireballs = new CheckFireballs(this.player, this.limitRect)

    this.jerry = ObjectsFactory.createJerry(this.limitRect.width - 100, 500)
    this.jerryAnimation = new MobAnimation(JERRY_TILES)

    this.jerryBehavior = new DummyBehavior(this.jerry, this.screenRect, this.limitRect)
    this.jerryBehavior.watch(this.player)

    this.env.addMob(this.player, this.jerry)

    this.background = new Background(this.screenRect, this.player.speed)

    this.camera = new MainCamera({
      edgeRect: this.edgeRect,
      limitRect: this.limitRect,
      screenRect: this.screenRect
    })

    this.backgroundAnimation = new BackgroundAnimation({
      background: this.background,
      camera: this.camera,
      edgeRect: this.edgeRect,
      screenRect: this.screenRect,
      limitRect: this.limitRect
    })

    this.playerAnimation.watch(this.player)
    this.jerryAnimation.watch(this.jerry)
    this.camera.watch(this.player)
    this.backgroundAnimation.watch(this.player)

    this.level = new Level01(this.spriteSize)
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
    this.jerryBehavior.update()
    this.checkFireballs.update()
    this.level.staticAnimations.forEach(staticAnimation => staticAnimation.update())

    this.camera.update()

    this.playerAnimation.update()
    this.jerryAnimation.update()
    this.backgroundAnimation.update()

    this.level.collisionRects = this.env.getAllCollisionRects().concat(
        this.checkFireballs.fireBallsAnimation.map(({ fireBall }) => {
          return this.collider.getCollisionRects(fireBall)
        }).flat())
    this.checkCoins.update(this.env.getMobCollisionRects(this.player))
  }
}