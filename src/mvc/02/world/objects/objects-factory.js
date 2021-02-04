import { Player } from './player'
import { FireBall } from './fire-ball'

export class ObjectsFactory {
  constructor() {
    //
  }

  static createRick() {
    return new Player({
      x: 10,
      y: 500,
      width: 60,
      height: 60,
      velocityMax: 50,
      jumpPower: 45,
      speed: 1.55,
    })
  }

  static createFireBall(player) {
    const fireBallSize = {
      width: 16 * 4,
      height: 6 * 4
    }

    const x = player.directionX === 1
                ? player.getRight() - 30
                : player.getLeft() - 25

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