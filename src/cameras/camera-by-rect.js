import { Camera } from '../camera'

export class CameraByRect extends Camera {
  constructor({ screen, edgeRect, screenRect, limitRect }) {
    super({ screenRect, limitRect })

    this.screen = screen
    this.edgeRect = edgeRect
  }

  render(time) {
    super.render(time)

    if (this.isWatchObject) {
      if (this.position.x > 0 && this.object.position.x - this.position.x < this.edgeRect.position.x) {
        this.position.x = this.object.position.x - this.edgeRect.position.x
        // console.log('Position x is', this.position.x, this.object.position.x, this.edgeRect.position.x)
      } else if (this.object.position.x > this.position.x + this.edgeRect.position.x + this.edgeRect.width - this.object.width) {
        this.position.x = this.object.position.x - (this.edgeRect.position.x + this.edgeRect.width - this.object.width)
      }

      this.screen.drawStroke(this.edgeRect, 'black')
    }
  }
}