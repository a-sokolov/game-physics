import { Job } from '../job/job'
import { Rect } from '../../base/rect'
import { Vector } from '../../base/vector'

export class MoveCoinToPlayer extends Job {
  constructor(player, coin, callback) {
    super()

    this.player = player
    this.coin = coin
    this.callback = callback
    this.steps = 0
  }

  run() {
    const [playerCenterX, playerCenterY] = Rect.getCenter(this.player)
    const [coinCenterX, coinCenterY] = Rect.getCenter(this.coin)

    const startPos = new Vector(coinCenterX, coinCenterY)
    const targetPos = new Vector(playerCenterX, playerCenterY)

    this.steps += 0.02
    startPos.lerp(targetPos.x, targetPos.y, this.steps)

    Rect.setCenter(this.coin, startPos.x, startPos.y)
  }
}