import { Mob } from '../mob'
import { Vector } from '../vector'

export const Position = {
  center: 'center',
  topLeft: 'topLeft',
  midTop: 'midTop',
  topRight: 'topRight',
  midLeft: 'midLeft',
  midRight: 'midRight',
  bottomLeft: 'bottomLeft',
  midBottom: 'midBottom',
  bottomRight: 'bottomRight'
}

export class Rect extends Mob {
  constructor(x, y, width, height) {
    super(x, y, 0, 0)

    this.width = width
    this.height = height
  }

  equals(rect) {
    return rect.position.equals(this.position)
        && rect.width === this.width
        && rect.height === this.height
  }

  setPosition(rect, position = Position.center) {
    const point = rect.getCenterPoint()

    switch (position) {
      case Position.center:
        this.position.x = (point.x - this.width / 2)
        this.position.y = (point.y - this.height / 2)
        break
      case Position.topLeft:
        this.position.x = rect.position.x
        this.position.y = rect.position.y
        break
      case Position.midTop:
        this.position.x = rect.position.x + rect.width / 2 - this.width / 2
        this.position.y = rect.position.y
        break
      case Position.topRight:
        this.position.x = rect.position.x + rect.width - this.width
        this.position.y = rect.position.y
        break
      case Position.midLeft:
        this.position.x = rect.position.x
        this.position.y = rect.position.y + rect.height / 2 - this.height / 2
        break
      case Position.midRight:
        this.position.x = rect.position.x + rect.width - this.width
        this.position.y = rect.position.y + rect.height / 2 - this.height / 2
        break
      case Position.bottomLeft:
        this.position.x = rect.position.x
        this.position.y = rect.position.y + rect.height - this.height
        break
      case Position.midBottom:
        this.position.x = rect.position.x + rect.width / 2 - this.width / 2
        this.position.y = rect.position.y + rect.height - this.height
        break
      case Position.bottomRight:
        this.position.x = rect.position.x + rect.width - this.width
        this.position.y = rect.position.y + rect.height - this.height
        break
      default:
        return
    }
  }

  getCenterPoint() {
    return new Vector(
      this.position.x + Math.round(this.width / 2)
      , this.position.y + Math.round(this.height / 2))
  }

  in(rect) {
    return (this.position.x >= rect.position.x &&
            this.position.y >= rect.position.y &&
            rect.position.x + rect.width >= this.position.x + this.width &&
            rect.position.y + rect.height >= this.position.y + this .height)

  }

  copy() {
    return new Rect(this.position.x, this.position.y, this.width, this.height)
  }
}