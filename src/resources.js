const src = require('./assets/resources.json')

export class Resources {
  constructor() {
    //
  }

  static getSprite(name) {
    return src.sprites.find((sprite) => sprite.name === name)
  }

  static getImg(name) {
    return src.images.find((image) => image.name === name)
  }
}