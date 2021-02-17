import { Camera } from '../camera'

export class CameraByCenter extends Camera {
  constructor({ scrollEdge, screenRect, limitRect }) {
    super({ screenRect, limitRect })

    this.scrollEdge = scrollEdge
  }

  render(time) {
    super.render(time)

    const { position } = this.object

    if (position.x > (this.position.x + this.screenRect.width - this.scrollEdge)) {
      this.position.x = Math.min(this.limitRect.width, position.x - this.screenRect.width + this.scrollEdge)
    }

    if (position.x < (this.position.x + this.scrollEdge)) {
      this.position.x = Math.max(0, position.x - this.scrollEdge)
    }
  }
}