import { Mob } from '../mob'

export class Circle extends Mob {
  constructor(x, y, velocityX, velocityY, radius) {
    super(x, y, velocityX, velocityY);

    this.radius = radius
  }
}