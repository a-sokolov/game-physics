import { Animator, AnimatorMode } from '../../graphic/animator'

export class EnemyAnimation extends Animator {
  constructor({ tiles, delay, key }) {
  const defaultFrame = tiles.getTileSet('idle')
    super(defaultFrame, delay.idle, AnimatorMode.loop, key)

    this.idle = defaultFrame
    this.mob = null
  }

  watch(mob) {
    this.mob = mob
  }

  position() {
    // Размещаем изображение по центру хитбокса игрока
    const { x, y, width, height } = this.mob
    const { width: spriteWidth, height: spriteHeight } = this.animation

    const newPosition = {
      x: x + (width / 2) - (spriteWidth / 2),
      y: y + height - spriteHeight + 48
    }

    // Зеркалим изображение в зависимости от направления игрока
    this.animation.flipped = (this.mob.directionX < 0)
    // Устанавливаем новую позицию
    this.animation.setXY(newPosition.x, newPosition.y)
  }

  update() {
    if (this.mob) {
      // const roundedVelocityX = Math.trunc(Math.abs(this.mob.velocityX))
      //
      // if (this.mob.idling) {
      //   this.changeFrameSet(this.idling, AnimatorMode.loop)
      // } else if (this.mob.velocityY < 0) {
      //   if (roundedVelocityX === 0) {
      //     this.changeFrameSet(this.jump, AnimatorMode.pause)
      //   } else if (this.mob.directionX < 0) {
      //     this.changeFrameSet(this.jumpLeft, AnimatorMode.pause);
      //   } else {
      //     this.changeFrameSet(this.jumpRight, AnimatorMode.pause);
      //   }
      // } else if (roundedVelocityX === 0) {
      //   this.changeFrameSet(this.stop, AnimatorMode.pause)
      // } else if (this.mob.directionX < 0) {
      //   if (this.mob.velocityX < -0.1) {
      //     this.changeFrameSet(this.moveLeft, AnimatorMode.loop, 5);
      //   } else {
      //     this.changeFrameSet(this.left, AnimatorMode.pause);
      //   }
      // } else if (this.mob.directionX > 0) {
      //   if (this.mob.velocityX > 0.1) {
      //     this.changeFrameSet(this.moveRight, AnimatorMode.loop, 5);
      //   } else {
      //     this.changeFrameSet(this.right, AnimatorMode.pause);
      //   }
      // }

      this.position()
      this.animate()
    }
  }
}