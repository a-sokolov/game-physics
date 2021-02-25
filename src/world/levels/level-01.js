import { Level } from '../level'
import { StaticMapAnimation } from '../../graphic/static-map-animation'
import { getTileMapPoints, RectPosition } from '../../utils'

import { LEVEL_TILES, COIN_TILES, SEA_IMAGE, SKY_IMAGE } from './constants'

const levelMap = require('../../assets/level01/level01.json')

export class Level01 extends Level {
  constructor() {
    super('level1', levelMap, LEVEL_TILES)

    const coinsBoxes = levelMap.layers.find(({ name }) => name === 'coins')
    const coins = getTileMapPoints(coinsBoxes,
      {
        width: LEVEL_TILES.spriteWidth,
        height: LEVEL_TILES.spriteHeight
      },
      {
        position: RectPosition
      })
    this.coinsStaticAnimation = new StaticMapAnimation(
      coins,
      COIN_TILES,
      { frames: [1, 2, 3, 4, 5, 6, 7, 8], delay: 2 })

    this.addStaticAnimation(this.coinsStaticAnimation)
  }

  createImages(display) {
    super.createImages(display)

    const backgroundContext = display.createContext(this.screenRect.width, this.screenRect.height)

    let x = 0
    let columns = Math.floor(this.screenRect.width / SKY_IMAGE.width) + 1
    for (let i = 1; i <= columns; i ++) {
      backgroundContext.drawImage(display.getImage(SKY_IMAGE.name), x, 0, SKY_IMAGE.width, SKY_IMAGE.height)
      x += SKY_IMAGE.width
    }

    x = 0
    columns = Math.floor(this.screenRect.width / SEA_IMAGE.width) + 1
    for (let i = 1; i <= columns; i ++) {
      backgroundContext.drawImage(display.getImage(SEA_IMAGE.name), x, SKY_IMAGE.height, SEA_IMAGE.width, SEA_IMAGE.height)
      x += SEA_IMAGE.width
    }

    const { canvas } = backgroundContext
    const name = `${SKY_IMAGE.name}-background`
    display.addImage(name, canvas)
    this.addImage(name, 0, 0, canvas.width, canvas.height)
  }
}