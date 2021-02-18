import { FireBall } from './fire-ball'
import { Mob } from '../../base/mob'

export class ObjectsFactory {
  constructor() {
    //
  }

  static createPlayer(x, y) {
    return new Mob({
      x,
      y,
      width: 16, // 22
      height: 32, // 31
      velocityMax: 50,
      jumpPower: 32,
      speed: 1.55,
    })
  }

  static createJerry(x, y) {
    return new Mob({
      x,
      y,
      width: 32,
      height: 32,
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

    const x = player.directionX === 1
                ? player.getRight() - fireBallSize.width
                : player.getLeft()

    return new FireBall({
      ...fireBallSize,
      x,
      y: player.getTop() + player.height / 3,
      directionX: player.directionX,
      index: window.performance.now(),
      speed: 25.5
    })
  }
}