import { Camera } from '../camera'
import { Rect } from '../shapes/rect'

export class CameraByRect extends Camera {
  constructor({ screen, edgeRect, screenRect, limitRect }) {
    super({ screenRect, limitRect })

    this.screen = screen
    this.edgeRect = edgeRect
    this.widthBetweenViewPortAndLimit = (this.screenRect.width - (this.edgeRect.position.x + this.edgeRect.width))

    const { position, width, height } = this.edgeRect

    this.startEdgeRect = new Rect(position.x, position.y, width, height)
    this.endEdgeRect = new Rect(this.limitRect.width - this.widthBetweenViewPortAndLimit - width, position.y, width, height)
  }

  render(time) {
    super.render(time)

    if (this.isWatchObject) {
      if (this.position.x > 0 && this.object.position.x - this.position.x < this.edgeRect.position.x) {
        /** Если уже есть x камеры и объект выходит за рамки viewport'а (назад по уровню), то высчитываем x координату */
        this.position.x = Math.max(0, this.object.position.x - this.edgeRect.position.x)
      } else if (this.object.position.x > this.position.x + this.edgeRect.position.x + this.edgeRect.width - this.object.width) {
        /** Если объект выходит за рамки viewport'а (вперед по уровню), то высчитываем x координату */
        this.position.x = this.object.position.x - (this.edgeRect.position.x + this.edgeRect.width - this.object.width)
      }

      if (this.object.position.x + this.object.width  > (this.limitRect.width - this.widthBetweenViewPortAndLimit)) {
        /**
         * Объект достиг границы лимита оп X координате с учетом viewport'а.
         * В этом случае мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку порта.
         * */
        if (this.screen.width === this.limitRect.width) {
          this.position.x = 0
        } else {
          this.position.x = this.limitRect.width - this.screenRect.width
        }
      }

      this.position.y = Math.min(0, -(this.edgeRect.position.y - this.object.position.y))

      // console.log('Position Y is', this.position.y, this.edgeRect.position.y, this.object.position.y)

      this.screen.drawStroke(this.startEdgeRect, 'green')
      this.screen.drawStroke(this.endEdgeRect, 'red')
      this.screen.drawStroke(this.edgeRect, 'black', false)
    }
  }
}