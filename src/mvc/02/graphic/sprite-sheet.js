import { Sprite } from './sprite'
import { Animation } from './animation'

export class SpriteSheet {
  constructor({ name, width, height, spriteWidth, spriteHeight }) {
    this.name = name
    this.width = width
    this.height = height
    this.spriteWidth = spriteWidth
    this.spriteHeight = spriteHeight
  }

  getAnimation(indexes, speed, repeat = true, autorun = true) {
    return new Animation({
      name: this.name,
      frames: indexes.map(index => ({ sx: this.getSourceX(index), sy: this.getSourceY(index) })),
      speed: speed,
      repeat: repeat,
      autorun: autorun,
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  getSprite(index) {
    return new Sprite({
      name: this.name,
      sourceX: this.getSourceX(index),
      sourceY: this.getSourceY(index),
      width: this.spriteWidth,
      height: this.spriteHeight
    })
  }

  getSourceX(index) {
    return (--index * this.spriteWidth) % this.width
  }

  getSourceY(index) {
    return Math.trunc((--index * this.spriteWidth) / this.width) * this.spriteHeight
  }
}

