import { Level } from '../level'
import { StaticMapAnimation } from '../../graphic/static-map-animation'
import { getTileMapPoints, getImageScreenCountsByX, RectPosition } from '../../utils'
import { Resources } from '../../resources'

const LEVEL_TILES = Resources.getSprite('level01-tileset')
const COIN_TILES = Resources.getSprite('coin-tiles')
const SEA_IMAGE = Resources.getImg('level01-sea')
const SKY_IMAGE = Resources.getImg('level01-sky')
const CLOUDS_IMAGE = Resources.getImg('level01-clouds')
const FAR_GROUNDS_IMAGE  = Resources.getImg('level01-far-grounds')

const levelMap = require('../../assets/level01/level01.json')

export class Level01 extends Level {
  constructor() {
    super('level01', levelMap, LEVEL_TILES)

    const coinsBoxes = levelMap.layers.find(({ name }) => name === 'coins')
    const coins = getTileMapPoints(coinsBoxes,
      { width: LEVEL_TILES.spriteWidth, height: LEVEL_TILES.spriteHeight },
      { position: RectPosition })
    this.coinsStaticAnimation = new StaticMapAnimation(
      coins,
      COIN_TILES,
      { frames: [1, 2, 3, 4, 5, 6, 7, 8], delay: 2 })

    this.addStaticAnimation(this.coinsStaticAnimation)
  }

  createImages(display) {
    super.createImages(display)

    const backgroundContext = display.createContext(this.screenRect.width, this.screenRect.height)

    getImageScreenCountsByX(this.screenRect.width, SKY_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SKY_IMAGE.name), x, 0,
        SKY_IMAGE.width, SKY_IMAGE.height)
    })

    getImageScreenCountsByX(this.screenRect.width, SEA_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(SEA_IMAGE.name), x,
        SKY_IMAGE.height, SEA_IMAGE.width, SEA_IMAGE.height)
    })

    getImageScreenCountsByX(this.screenRect.width, CLOUDS_IMAGE.width, (x) => {
      backgroundContext.drawImage(display.getImage(CLOUDS_IMAGE.name), x,
        SKY_IMAGE.height - CLOUDS_IMAGE.height, CLOUDS_IMAGE.width, CLOUDS_IMAGE.height)
    })

    backgroundContext.drawImage(display.getImage(FAR_GROUNDS_IMAGE.name), 0,
      this.screenRect.height - FAR_GROUNDS_IMAGE.height, FAR_GROUNDS_IMAGE.width, FAR_GROUNDS_IMAGE.height)

    const { canvas } = backgroundContext
    const name = 'level01-background'
    display.addImage(name, canvas)
    this.addImage(name, 0, 0, canvas.width, canvas.height)
  }
}