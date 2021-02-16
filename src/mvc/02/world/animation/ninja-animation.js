import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'

export class NinjaAnimation extends Animator {
  constructor(tileProps) {
    const tiles = new SpriteSheet(tileProps)

    const defaultFrame = tiles.getAnimationFrames(1, 2, 3, 4)
    super(defaultFrame, 5, AnimatorMode.loop)

    this.jump = tiles.getAnimationFrames(15, 16, 17, 18)
    this.crouch = tiles.getAnimationFrames(5, 6, 7, 8)
    this.idle = defaultFrame

    this.left = tiles.getAnimationFrames(5)
    this.right = tiles.getAnimationFrames(15)

    this.jumpLeft = tiles.getAnimationFrames(6)
    this.jumpRight = tiles.getAnimationFrames(15)

    this.moveLeft = tiles.getAnimationFrames(5, 6, 7, 8)
    this.moveRight = tiles.getAnimationFrames(9, 10, 11, 12, 13, 14)

    this.changeFrameSet(defaultFrame)
    this.mob = null
  }

  watch(mob) {
    this.mob = mob
  }

  update() {
    if (this.mob) {
      const roundedVelocityX = Math.trunc(Math.abs(this.mob.velocityX))

      if (this.mob.crouching) {
        this.changeFrameSet(this.crouch, AnimatorMode.loop, 5)
      } else {
        if (this.mob.velocityY < 0) {
          this.changeFrameSet(this.jump, AnimatorMode.pause, 1)
        } else if (!this.mob.jumping) {
          if (roundedVelocityX === 0) {
            this.changeFrameSet(this.idle, AnimatorMode.loop, 5)
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
        }
      }

      this.animation.setXY(this.mob.x, this.mob.y)
      this.animate()
    }
  }
}