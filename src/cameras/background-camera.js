import { Camera } from '../camera'
import { Direction } from '../parallax-image'

export class BackgroundCamera extends Camera {
  constructor({ background, screenRect, limitRect }) {
    super({ screenRect, limitRect })

    this.background = background
    this.lastPosition = null
  }

  render(time) {
    super.render(time)

    if (this.isWatchObject) {
      const { position } = this.object

      if (this.lastPosition) {
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