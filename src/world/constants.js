import { TilesetSpriteSheet } from '../graphic/tileset-sprite-sheet'
import { Resources} from '../resources'

const SKELETON_TILES = Resources.getSprite('skeleton-tiles')

export const EnemyType = {
  skeleton: {
    key: 'skeleton',
    tiles: new TilesetSpriteSheet(SKELETON_TILES, require('../assets/enemies/skeleton.json')),
    delay: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    }
  },
  flyingEye: 'flyingEye',
  goblin: 'goblin',
  mushroom: 'mushroom'
}