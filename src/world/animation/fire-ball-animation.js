import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'

export const FIREBALL_TILES = {
  name: 'red-fire-ball-tiles',
  width: 3072,
  height: 394,
  spriteWidth: 512,
  spriteHeight: 197
}

export class FireBallAnimation extends Animator {
  constructor(fireBall) {
    const tiles = new SpriteSheet(FIREBALL_TILES)

    let frames
    if (fireBall.directionX === 1) {
      frames = tiles.getAnimationFrames(7, 8, 9, 10, 11, 12)
    } else {
      frames = tiles.getAnimationFrames(1, 2, 3, 4, 5, 6)
    }

    super(frames, 2, AnimatorMode.loop)
    this.fireBall = fireBall
    this.animation.setXY(this.fireBall.x, this.fireBall.y)
  }

  update() {
    this.animation.setXY(this.fireBall.x, this.fireBall.y)
    this.animate()
  }
}