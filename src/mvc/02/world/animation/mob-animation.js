import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'

export class MobAnimation extends Animator {
  constructor(tileProps) {
    const tiles = new SpriteSheet(tileProps)

    const defaultFrame = tiles.getAnimationFrames(1)
    super(defaultFrame, 10)

    this.stop = defaultFrame
    this.jump = tiles.getAnimationFrames(9)

    this.left = tiles.getAnimationFrames(5)
    this.right = tiles.getAnimationFrames(15)

    this.jumpLeft = tiles.getAnimationFrames(6)
    this.jumpRight = tiles.getAnimationFrames(15)

    this.moveLeft = tiles.getAnimationFrames(5, 6, 7, 8)
    this.moveRight = tiles.getAnimationFrames(13, 14, 15, 16)

    this.changeFrameSet(defaultFrame)
    this.mob = null
  }

  watch(mob) {
    this.mob = mob
  }

  update() {
    if (this.mob) {
      const roundedVelocityX = Math.trunc(Math.abs(this.mob.velocityX))

      if (this.mob.velocityY < 0) {
        if (roundedVelocityX === 0) {
          this.changeFrameSet(this.jump, AnimatorMode.pause)
        } else if (this.mob.directionX < 0) {
          this.changeFrameSet(this.jumpLeft, AnimatorMode.pause);
        } else {
          this.changeFrameSet(this.jumpRight, AnimatorMode.pause);
        }
      } else if (roundedVelocityX === 0) {
        this.changeFrameSet(this.stop, AnimatorMode.pause)
      } else if (this.mob.directionX < 0) {
        if (this.mob.velocityX < -0.1) {
          this.changeFrameSet(this.moveLeft, AnimatorMode.loop, 5);
        } else {
          this.changeFrameSet(this.left, AnimatorMode.pause);
        }
      } else if (this.mob.directionX > 0) {
        if (this.mob.velocityX > 0.1) {
          this.changeFrameSet(this.moveRight, AnimatorMode.loop, 5);
        } else {
          this.changeFrameSet(this.right, AnimatorMode.pause);
        }
      }

      this.animation.setXY(this.mob.x, this.mob.y)
      this.animate()
    }
  }
}