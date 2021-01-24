import { Scene } from '../scene'

export class MovementScene extends Scene {
  constructor(game, player) {
    super(game)

    this.player = player
  }

  render(time) {
    super.render(time)

    this.player.render(time)
  }
}