import { Vector } from './vector'

export class Camera {
  constructor({ screenRect, limitRect }) {
    this.position = Vector.zero()

    this.screenRect = screenRect
    this.limitRect = limitRect

    this.isWatchObject = false
    this.object = null
  }

  watch(object) {
    this.isWatchObject = true
    this.object = object
  }

  render(time) {
    //
  }
}