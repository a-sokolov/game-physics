import { Camera } from '../camera'
import { Position } from '../shapes/rect'
import { Vector } from '../vector'

export class CameraByRect extends Camera {
  constructor({ screen, edgeRect, screenRect, limitRect }) {
    super({ screenRect, limitRect })

    this.screen = screen
    this.edgeRect = edgeRect

    // this.damping = 1.5
    // this.offset = new Vector(2, 1)
    // this.faceLeft = false
    // this.lastPoint = Vector.zero()
  }

  render(time) {
    super.render(time)

    if (this.isWatchObject) {
      if (!this.object.in(this.edgeRect)) {

      }

      // const currentX = Math.floor(this.object.position.x);
      // this.faceLeft = (currentX > this.lastPoint.x)
      // this.lastPoint = this.object.position.copy()
      //
      // let target
      // if (this.faceLeft) {
      //   target = new Vector(this.object.position.x - this.offset.x, this.object.position.y + this.offset.y);
      // } else {
      //   target = new Vector(this.object.position.x + this.offset.x, this.object.position.y + this.offset.y);
      // }
      //
      // this.position.lerp(target, this.damping);
      // console.log('Current position is', this.position)

      // this.edgeRect.setPosition(this.object, Position.center)
      //
      // if (this.edgeRect.position.x + this.edgeRect.width >= this.limitRect.width) {
      //   this.edgeRect.position.x = this.limitRect.width - this.edgeRect.width
      // } else if (this.edgeRect.position.x < 0) {
      //   this.edgeRect.position.x = 0
      // }
      //
      // if (this.edgeRect.position.y + this.edgeRect.height > this.limitRect.height) {
      //   this.edgeRect.position.y = this.limitRect.height - this.edgeRect.height
      // } else if (this.edgeRect.position.y < 0) {
      //   this.edgeRect.position.y = 0
      // }
      //
      // const objectCenter = this.object.getCenterPoint()
      // const rectCenter = this.edgeRect.getCenterPoint()
      //
      // if (objectCenter.equals(rectCenter)) {
      //   // console.log('Center are equals')
      //   this.position = Vector.zero()
      // } else {
      //   const diff = objectCenter.subtract(rectCenter)
      //   // console.log(`Diff is ${diff}`)
      //   this.position = diff
      // }

      this.screen.drawStroke(this.edgeRect, 'black')
    }
  }
}