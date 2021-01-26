import { Direction } from '../parallax-image'

export class BackgroundController  {
  constructor({ background, camera, screenRect, edgeRect, limitRect }) {
    this.background = background
    this.lastPosition = null
    this.screenRect = screenRect
    this.edgeRect = edgeRect
    this.limitRect = limitRect
    this.camera = camera

    this.maxViewPortalX = this.limitRect.width - this.screenRect.width + this.edgeRect.position.x + this.edgeRect.width

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
        || (position.x < this.edgeRect.position.x)
        || (this.limitRect.width === this.screenRect.width)
        || (this.maxViewPortalX < (this.object.position.x + this.object.width))) {
        // Когда объект выходит за рамки viewport'а, то останавливаем анимацию
        this.background.stop()
      } else if (this.lastPosition) {
        if (this.lastPosition.x === position.x) {
          // Если нет движения, то останавливаем анимацию
          this.background.stop()
        }
        if (this.lastPosition.x > position.x) {
          // Если объект дальше последней точки, то двигаем вперед
          this.background.run(Direction.backward)
        }
        if (this.lastPosition.x < position.x) {
          // Если объект находится до последней точки, то двигаем назад
          this.background.run(Direction.forward)
        }
      }

      this.lastPosition = position.copy()
    }
  }
}