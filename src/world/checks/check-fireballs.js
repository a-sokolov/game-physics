import { ObjectsFactory } from '../objects/objects-factory'
import { FireBallAnimation } from '../animation/fire-ball-animation'

export class CheckFireballs {
  constructor(player, limitRect) {
    this.player = player
    this.limitRect = limitRect
    this.fireBallsAnimation = []
  }

  fire() {
    if (!this.player.casting) {
      this.player.casting = true

      const fireBall = ObjectsFactory.createFireBall(this.player)
      this.fireBallsAnimation.push(new FireBallAnimation(fireBall))

      setTimeout(() => this.player.casting = false, 200)
    }
  }

  update() {
    this.fireBallsAnimation.forEach(({ fireBall }) => fireBall.update())
    this.fireBallsAnimation.forEach(fireBallAnimation => fireBallAnimation.update())

    this.fireBallsAnimation = this.fireBallsAnimation.filter(({ fireBall }) => {
      return fireBall.getRight() >= 0 && fireBall.getRight() <= this.limitRect.width
    })
  }
}