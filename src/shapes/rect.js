import { Mob } from '../mob'

export class Rect extends Mob {
  constructor(x, y, width, height) {
    super(x, y, 0, 0)

    this.width = width
    this.height = height
  }
}