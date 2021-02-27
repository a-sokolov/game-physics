import { Level } from '../level'
import { Resources } from '../../resources'
import { createCoinsStaticAnimation } from './helpers'

const LEVEL_TILES = Resources.getSprite('level01-tileset')

const levelMap = require('../../assets/level01/level01.json')

export class Level02 extends Level {
  constructor() {
    super('level02', levelMap, LEVEL_TILES)

    this.coinsStaticAnimation = createCoinsStaticAnimation(levelMap, LEVEL_TILES)
    this.addStaticAnimation(this.coinsStaticAnimation)
  }
}