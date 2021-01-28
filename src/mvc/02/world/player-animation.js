import { SpriteSheet } from '../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../graphic/animator'

export class PlayerAnimation extends Animator {
  constructor(tileProps, speed) {
    const tiles = new SpriteSheet(tileProps)

    const defaultFrame = tiles.getAnimation([1])
    super(defaultFrame, 10)

    this.speed = speed

    this.stop = defaultFrame
    this.jump = tiles.getAnimation([9])

    this.left = tiles.getAnimation([5])
    this.right = tiles.getAnimation([14])

    this.jumpLeft = tiles.getAnimation([6])
    this.jumpRight = tiles.getAnimation([15])

    // this.moveUp = tiles.getAnimation([9, 10, 11, 12], speed)
    // this.moveDown = tiles.getAnimation([1, 2, 3, 4], speed)
    this.moveLeft = tiles.getAnimation([5, 6, 7, 8], speed)
    this.moveRight = tiles.getAnimation([13, 14, 15, 16], speed)

    this.current = defaultFrame
    this.player = null
  }

  watch(player) {
    this.player = player
  }

  update(time) {
    if (this.player) {
      if (this.player.velocityY < 0) {
        if (this.player.directionX < 0) {
          this.changeFrameSet(this.jumpLeft, AnimatorMode.pause);
        } else {
          this.changeFrameSet(this.jumpRight, AnimatorMode.pause);
        }
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
      this.current = this.animation
    }

    // if (this.player) {
    //   const playerX = this.player.x
    //   const currentX = this.player.oldX
    //
    //   let speed = this.speed
    //   if (playerX !== currentX) {
    //     if (playerX - currentX > 0) {
    //       // move right
    //       this.current = this.player.jumping ? this.jumpRight : this.moveRight
    //     } else {
    //       // move left
    //       this.current = this.player.jumping ? this.jumpLeft : this.moveLeft
    //     }
    //   }
    //
    //   if (playerX === 0 || playerX === currentX) {
    //     // stop
    //     this.current = this.stop
    //   } else {
    //     const distance = Math.abs(playerX - currentX)
    //     if (distance < this.player.speed) {
    //       const slowDown = (this.speed * (( (this.player.speed - distance) / (this.player.speed / 100) ) / 100))
    //       speed = this.speed + slowDown
    //       if (this.player.speed / 4 < slowDown) {
    //         // slow down
    //         this.current = this.current === this.moveLeft || this.current === this.jumpLeft ? this.left : this.right
    //       }
    //     }
    //   }
    //
    //   this.current.setSpeed(speed)
    //   this.current.update(time)
    // }
  }
}