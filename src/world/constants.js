import { TilesetSpriteSheet } from '../graphic/tileset-sprite-sheet'
import { Resources} from '../resources'
import { ObjectsFactory } from './objects/objects-factory'

const SKELETON_TILES = Resources.getSprite('skeleton-tiles')
const FLYING_EYE_TILES = Resources.getSprite('flying-eye-tiles')
const GOBLIN_TILES = Resources.getSprite('goblin-tiles')
const MUSHROOM_TILES = Resources.getSprite('mushroom-tiles')

export const EnemyType = {
  skeleton: {
    key: 'skeleton',
    create: ObjectsFactory.createSkeleton,
    tiles: new TilesetSpriteSheet(SKELETON_TILES, require('../assets/enemies/skeleton.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    }
  },
  flyingEye: {
    key: 'flying-eye',
    create: ObjectsFactory.createFlyingEye,
    tiles: new TilesetSpriteSheet(FLYING_EYE_TILES, require('../assets/enemies/flying-eye.json')),
    delays: {
      idle: 3,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    }
  },
  goblin: {
    key: 'goblin',
    create: ObjectsFactory.createGoblin,
    tiles: new TilesetSpriteSheet(GOBLIN_TILES, require('../assets/enemies/goblin.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    }
  },
  mushroom: {
    key: 'mushroom',
    create: ObjectsFactory.createMushroom,
    tiles: new TilesetSpriteSheet(MUSHROOM_TILES, require('../assets/enemies/mushroom.json')),
    delays: {
      idle: 5,
      attack: 2,
      move: 2,
      dead: 2,
      block: 2,
      takeHit: 2
    }
  }
}