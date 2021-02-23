import { Level } from '../level'
import { StaticMapAnimation } from '../../graphic/static-map-animation'
import { getTileMapPoints, RectPosition } from '../../utils'

const levelMap = require('../../assets/level01/level01.json')

const COIN_TILES = {
  name: 'coin-tiles',
  width: 512,
  height: 256,
  spriteWidth: 128,
  spriteHeight: 128
}

const LEVEL_TILES = {
  name: 'level01-tileset',
  width: 928,
  height: 320,
  spriteWidth: 16,
  spriteHeight: 16
}

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
}