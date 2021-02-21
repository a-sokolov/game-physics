import { FireBall } from './fire-ball'
import { Mob } from '../../base/mob'
import { Ninja } from './ninja'

export class ObjectsFactory {
  constructor() {
    //
  }

  static createPlayer(x, y) {
    return new Ninja({
      x,
      y,
      width: 16,
      height: 16,
      velocityMax: 50,
      jumpPower: 32,
      speed: 1.55,
      hitBox: { width: 16, height: 32 }
    })
  }

  static createJerry(x, y) {
    return new Mob({
      x,
      y,
      width: 16,
      height: 16,
      velocityMax: 30,
      jumpPower: 30,
      speed: 1.2,
    })
  }

  static createFireBall(player) {
    const fireBallSize = {
      width: 32,
      height: 12
    }

    const x = player.directionX === -1
                ? player.getRight() - fireBallSize.width - 10
                : player.getLeft() + 10

    const y = player.y + player.height - player.hitBox.height

    return new FireBall({
      ...fireBallSize,
      x,
      y: y + (player.hitBox.height / 2) - 6,
      directionX: player.directionX,
      index: window.performance.now(),
      speed: 10.5
    })
  }
}