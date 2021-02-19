import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'

export class NinjaAnimation extends Animator {
  constructor(tileProps) {
    const tiles = new SpriteSheet(tileProps)

    const defaultFrame = tiles.getAnimationFrames(1, 2, 3, 4)
    super(defaultFrame, 5, AnimatorMode.loop)

    this.idle = defaultFrame
    this.crouch = tiles.getAnimationFrames(5, 6, 7, 8)

    this.stay = tiles.getAnimationFrames(9)
    this.flip = tiles.getAnimationFrames(19, 20, 21, 22)
    this.fall = tiles.getAnimationFrames(23, 24)
    this.jump = tiles.getAnimationFrames(15, 16, 17, 18)
    this.move = tiles.getAnimationFrames(9, 10, 11, 12, 13, 14)
    this.cast = tiles.getAnimationFrames(89, 90, 91, 92, 93)
    this.attack1 = tiles.getAnimationFrames(43, 44, 45, 46, 47, 48, 49)
    this.attack2 = tiles.getAnimationFrames(50, 51, 52, 53)

    this.attacks = [this.attack1, this.attack2]
    this.attackIndex = 0

    this.changeFrameSet(defaultFrame)
    this.mob = null
  }

  watch(mob) {
    this.mob = mob
  }

  update() {
    if (this.mob) {
      const velocityX = Math.abs(this.mob.velocityX)

      if (this.mob.crouching) {
        // Приседания
        this.crouch.flipped = (this.mob.directionX < 0)
        this.changeFrameSet(this.crouch, AnimatorMode.loop, 4)
      } else if (this.mob.casting) {
        // Кастуем файер
        this.cast.flipped = (this.mob.directionX < 0)
        this.changeFrameSet(this.cast, AnimatorMode.pause, 1)
      } else if (this.mob.swordAttack) {
        // Атакуем мечом
        if (!this.attacks.find(animation => animation === this.animation)) {
          const attackAnimation = this.attacks[this.attackIndex]
          attackAnimation.flipped = (this.mob.directionX < 0)
          this.changeFrameSet(attackAnimation, AnimatorMode.pause, 2)
          this.attackIndex ++
          if (this.attackIndex > this.attacks.length - 1) {
            this.attackIndex = 0
          }
        }
      } else {
        if (this.mob.velocityY < 0) {
          if (this.mob.velocityY > -17) {
            // Переворот в верхней точке прыжка
            this.flip.flipped = (this.mob.directionX < 0)
            this.changeFrameSet(this.flip, AnimatorMode.pause, 2)
          } else {
            // Прыжок
            this.jump.flipped = (this.mob.directionX < 0)
            this.changeFrameSet(this.jump, AnimatorMode.pause, 1)
          }
        } else if (this.mob.velocityY > 11) {
          // Падение вниз
          this.fall.flipped = (this.mob.directionX < 0)
          this.changeFrameSet(this.fall, AnimatorMode.pause, 2)
        } else if (!this.mob.jumping) {
          if (velocityX < 0.08) {
            // Ожидание
            this.idle.flipped = (this.mob.directionX < 0)
            this.changeFrameSet(this.idle, AnimatorMode.loop, 4)
          } else if (!(velocityX < 1)) {
            // Двигаемся
            this.move.flipped = (this.mob.directionX < 0)
            this.changeFrameSet(this.move, AnimatorMode.loop, 3)
          }
        }
      }

      // Размещаем изображение по центру хитбокса игрока
      const { x, y, width, height } = this.mob
      const { width: spriteWidth, height: spriteHeight } = this.animation

      const newPosition = {
        x: x + (width / 2) - (spriteWidth / 2),
        y: y + height - spriteHeight
      }

      this.animation.setXY(newPosition.x, newPosition.y)
      if (velocityX < 1 && velocityX > 0.09) {
        // Если ускорение по X координате маленькое, то останавливаем анимацию
        this.stop()
      } else {
        // Проигрываем анимацию
        this.animate()
      }
    }
  }
}