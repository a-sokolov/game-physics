import { SpriteSheet } from '../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../graphic/animator'

export class PlayerAnimation extends Animator {
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
    this.player = null
  }

  watch(player) {
    this.player = player
  }

  update() {
    if (this.player) {
      const roundedVelocityX = Math.trunc(Math.abs(this.player.velocityX))

      if (this.player.velocityY < 0) {
        if (roundedVelocityX === 0) {
          this.changeFrameSet(this.jump, AnimatorMode.pause)
        } else if (this.player.directionX < 0) {
          this.changeFrameSet(this.jumpLeft, AnimatorMode.pause);
        } else {
          this.changeFrameSet(this.jumpRight, AnimatorMode.pause);
        }
      } else if (roundedVelocityX === 0) {
        this.changeFrameSet(this.stop, AnimatorMode.pause)
      } else if (this.player.directionX < 0) {
        if (this.player.velocityX < -0.1) {
          this.changeFrameSet(this.moveLeft, AnimatorMode.loop, 5);
        } else {
          this.changeFrameSet(this.left, AnimatorMode.pause);
        }
      } else if (this.player.directionX > 0) {
        if (this.player.velocityX > 0.1) {
          this.changeFrameSet(this.moveRight, AnimatorMode.loop, 5);
        } else {
          this.changeFrameSet(this.right, AnimatorMode.pause);
        }
      }

      this.animate()
      this.animation.setXY(this.player.x, this.player.y)
    }
  }
}