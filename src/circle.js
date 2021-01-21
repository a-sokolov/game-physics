import { Mob } from './mob'

export class Circle extends Mob {
  constructor(x, y, velocityX, velocityY, speed, radius) {
    super(x, y, velocityX, velocityY, speed);

    this.radius = radius
  }
}