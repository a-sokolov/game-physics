import { HMovingObject } from '../../base/hmoving-object'
import { Ninja } from './ninja'
import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Resources } from '../../resources'
import { Enemy } from './enemy'

export class ObjectsFactory {
  constructor() {
    //
  }

  static createPlayer(x, y, props) {
    return new Ninja({
      ...props,
      x,
      y
    })
  }

  static createFireBall(player) {
    const fireballProps = {
      width: 32,
      height: 12,
      speed: 10.5,
      key: 'fire-ball'
    }

    const x = player.directionX === -1
                ? player.getRight() - fireballProps.width - 10
                : player.getLeft() + 10

    const y = player.y + player.height - player.hitBox.height

    return {
      object: new HMovingObject({
        ...fireballProps,
        x,
        y: y + (player.hitBox.height / 2) - 6,
        directionX: player.directionX,
      }),
      frames: new SpriteSheet(Resources.getSprite('red-fire-ball-tiles'))
                .getAnimationFrames(7, 8, 9, 10, 11, 12),
      delay: 2
    }
  }

  static createArrow(player) {
    const arrowProps = {
      width: 18,
      height: 3,
      speed: 18,
      key: 'arrow'
    }

    const x = player.directionX === -1
      ? player.getRight() - arrowProps.width - 10
      : player.getLeft() + 10

    const y = player.y + player.height - player.hitBox.height

    return {
      object: new HMovingObject({
        ...arrowProps,
        x,
        y: y + (player.hitBox.height / 2) - 2,
        directionX: player.directionX,
      }),
      frames: new SpriteSheet(Resources.getSprite('arrow'))
                .getAnimationFrames(1),
      delay: 2
    }
  }

  static createEnemy(x, y, props) {
    const enemy = new Enemy({
      ...props,
      x,
      y
    })

    enemy.isCanBlocking = props?.isCanBlocking ?? false
    return enemy
  }
}