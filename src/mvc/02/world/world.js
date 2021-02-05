import { Background } from './objects/background'
import { ObjectsFactory } from './objects/objects-factory'

import { PlayerAnimation } from './animation/player-animation'
import { BackgroundAnimation } from './animation/background-animation'
import { FireBallAnimation } from './animation/fire-ball-animation'

import { CollideObject } from './collide-object'

import { Rect } from '../base/rect'
import { MainCamera} from './main-camera'

import { Level01 } from './levels/level-01'
import { checkRectCollision } from '../utils'
import { Vector } from '../base/vector'
import {CheckCoins} from "./checks/check-coins";

export const PLAYER_TILES = {
  name: 'rick-tiles',
  width: 512,
  height: 660,
  spriteWidth: 128,
  spriteHeight: 165
}

export class World {
  constructor(friction = 0.85, gravity = 2) {
    this.backgroundColor = 'orange'
    this.width = 1024
    this.height = 640
    this.spriteSize = {
      width: 64,
      height: 64
    }

    this.friction = friction
    this.gravity = gravity

    this.playerCollisionRects = []
    this.player = ObjectsFactory.createRick()
    this.playerAnimation = new PlayerAnimation(PLAYER_TILES)

    this.edgeRect = new Rect(300, this.height / 2, this.width / 2 - 300, this.height / 2)
    this.screenRect = new Rect(0, 0, this.width, this.height)
    this.limitRect = new Rect(0, 0, this.width * 2, this.height * 2)

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
    this.camera.watch(this.player)
    this.backgroundAnimation.watch(this.player)

    this.fireBallsAnimation = []

    this.level = new Level01(this.spriteSize)
    this.collider = new CollideObject()
    this.collider.setLevel(this.level)

    this.checkCoins = new CheckCoins(this.player, this.level.coinsStaticAnimation)
  }

  collideObject(object, limitRect) {
    if (object.getLeft() < 0) {
      object.setLeft(0)
      object.velocityX = 0
    } else if (object.getRight() > limitRect.width) {
      object.setRight(limitRect.width)
      object.velocityX = 0
    }

    // if (object.getTop() < 0) {
    //   object.setTop(0)
    //   object.velocityY = 0
    // } else if (object.getBottom() > limitRect.height) {
    //   object.setBottom(limitRect.height)
    //   object.velocityY = 0
    //   object.jumping = false
    // }

    this.playerCollisionRects = this.collider.collideObject(object)
    this.level.collisionRects = this.playerCollisionRects.concat(
      this.fireBallsAnimation.map(({ fireBall }) => {
        return this.collider.getCollisionRects(fireBall)
      }).flat())
  }

  fire() {
    if (!this.player.firing) {
      this.player.firing = true

      const fireBall = ObjectsFactory.createFireBall(this.player)
      this.fireBallsAnimation.push(new FireBallAnimation(fireBall))

      setTimeout(() => this.player.firing = false, 200)
    }
  }

  update() {
    this.player.velocityY += this.gravity
    this.player.updatePosition(this.gravity, this.friction)
    this.fireBallsAnimation.forEach(({ fireBall }) => fireBall.update())
    this.level.staticAnimations.forEach(staticAnimation => staticAnimation.update())

    this.collideObject(this.player, this.limitRect)
    this.camera.update()

    this.playerAnimation.update()
    this.fireBallsAnimation.forEach(fireBallAnimation => fireBallAnimation.update())
    this.backgroundAnimation.update()

    this.fireBallsAnimation = this.fireBallsAnimation.filter(({ fireBall }) => {
      return fireBall.getRight() >= 0 && fireBall.getRight() <= this.limitRect.width
    })

    this.checkCoins.update(this.playerCollisionRects)
  }
}