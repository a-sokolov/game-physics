import { Camera } from './base/camera'

export class MainCamera extends Camera {
  constructor({ edgeRect, screenRect, limitRect }) {
    super()

    this.edgeRect = edgeRect
    this.screenRect = screenRect
    this.limitRect = limitRect
    this.widthBetweenViewPortAndLimit = (this.screenRect.width - (this.edgeRect.x + this.edgeRect.width))

    this.startEdgeRect = { ...this.edgeRect }
    this.endEdgeRect = {
      ...this.edgeRect,
      x: this.limitRect.width - this.widthBetweenViewPortAndLimit - this.edgeRect.width
    }

    this.rects = [
      { rect: this.startEdgeRect, color: 'green' },
      { rect: this.endEdgeRect, color: 'red' },
      { rect: this.edgeRect, color: 'black', sticky: true },
    ]
   }

  update() {
    super.update()

    if (this.object) {
      if (this.x > 0 && this.object.x - this.x < this.edgeRect.x) {
        /** Если уже есть x камеры и объект выходит за рамки viewport'а (назад по уровню), то высчитываем x координату */
        this.x = Math.max(0, this.object.x - this.edgeRect.x)
      } else if (this.object.x > this.x + this.edgeRect.x + this.edgeRect.width - this.object.width) {
        /** Если объект выходит за рамки viewport'а (вперед по уровню), то высчитываем x координату */
        this.x = this.object.x - (this.edgeRect.x + this.edgeRect.width - this.object.width)
      }

      if (this.object.x + this.object.width  > (this.limitRect.width - this.widthBetweenViewPortAndLimit)) {
        /**
         * Объект достиг границы лимита оп X координате с учетом viewport'а.
         * В этом случае мы должны дать ему пройти до конца (за границу) уровня, не двигая рамку порта.
         * */
        if (this.screenRect.width === this.limitRect.width) {
          this.x = 0
        } else {
          this.x = this.limitRect.width - this.screenRect.width
        }
      }

      this.y = Math.min(0, -(this.edgeRect.y - this.object.y))
    }
  }
}