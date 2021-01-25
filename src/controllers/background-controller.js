import { Direction } from '../parallax-image'
import { Rect } from '../shapes/rect'

export class BackgroundController  {
  constructor(background, camera, edgeRect) {
    this.background = background
    this.lastPosition = null
    this.edgeRect = edgeRect
    this.camera = camera

    this.isWatchObject = false
    this.object = null
  }

  watch(object) {
    this.object = object
    this.isWatchObject = true
  }

  render(time) {
      if (this.isWatchObject) {
      const { position } = this.object

      const x1 = this.edgeRect.position.x + this.camera.position.x + 0.01
      const y1 = this.edgeRect.position.y + this.camera.position.y + 0.01

      const x2 = this.edgeRect.position.x + this.camera.position.x + this.edgeRect.width - 0.01
      const y2 = this.edgeRect.position.y + this.camera.position.y + this.edgeRect.height - 0.01

      if ((position.x > x1 && position.x + this.object.width < x2)
        || (position.x < this.edgeRect.position.x)) {
        this.background.stop()
      } else if (this.lastPosition) {
        if (this.lastPosition.x === position.x) {
          this.background.stop()
        }
        if (this.lastPosition.x > position.x) {
          this.background.run(Direction.backward)
        }
        if (this.lastPosition.x < position.x) {
          this.background.run(Direction.forward)
        }
      }

      this.lastPosition = position.copy()
    }
  }
}