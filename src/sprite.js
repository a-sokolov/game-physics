import { Img } from './img'

export class Sprite extends Img {
  constructor({ imageName, sourceX = 0, sourceY = 0, x, y, width, height }) {
    super({ imageName, x, y, width, height })
    this.sourceX = sourceX
    this.sourceY = sourceY
  }
}