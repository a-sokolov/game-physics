import { Direction } from './parallax-image'

export class Camera {
  constructor(game, limitX, scrollEdge) {
    this.game = game
    this.lastX = 0
    this.x = 0
    this.limitX = limitX
    this.scrollEdge = scrollEdge

    this.isWatchObject = false
    this.obj = null
  }

  watch(obj) {
    this.isWatchObject = true
    this.obj = obj
  }

  render(time) {
    if (this.isWatchObject) {
      const objectX = this.obj.position.x
      if (this.lastX === objectX) {
        this.game.background.stop()
      }
      if (this.lastX > objectX) {
        this.game.background.run(Direction.backward)
      }
      if (this.lastX < objectX) {
        this.game.background.run(Direction.forward)
      }

      if (objectX > (this.x + this.game.screen.width - this.scrollEdge)) {
        this.x = Math.min(this.limitX, objectX - this.game.screen.width + this.scrollEdge)
      }

      if (objectX < (this.x + this.scrollEdge)) {
        this.x = Math.max(0, objectX - this.scrollEdge)
      }

      this.lastX = objectX
    }
  }
}