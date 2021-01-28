import { Img } from './img'

export class Sprite extends Img {
  constructor({ name, sourceX = 0, sourceY = 0, x, y, width, height, offsetX, offsetY }) {
    super({ name, x, y, width, height })
    this.sourceX = sourceX
    this.sourceY = sourceY
    this.offsetX = offsetX
    this.offsetY = offsetY
  }
}