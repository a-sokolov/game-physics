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

      const rect = new Rect(
        this.edgeRect.position.x + this.camera.position.x - 0.01,
        this.edgeRect.position.y + this.camera.position.y - 0.01,
        this.edgeRect.width,
        this.edgeRect.height)

      // console.log(`${position.x} ${this.edgeRect.position.x} ${this.camera.position.x}`)

      if (this.object.in(rect) || this.camera.position.x < this.edgeRect.x) {
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