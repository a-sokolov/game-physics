import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'
import { NinjaActionType, NinjaInterpretator } from '../interpretators/ninja-interpretator'

export const NinjaAnimationDelay = {
  idle: 4,
  crouch: 4,
  slide: 5,
  cast: 3,
  sword: 2,
  airSword: 2,
  bow: 3,
  airBow: 1,
  flip: 2,
  jump: 1,
  fall: 2,
  touch: 3,
  move: 3
}

/** Здесь определяем анимацию персонажа в зависимости от его координат и скоростей */
export class NinjaAnimation extends Animator {
  constructor({ main, bow }) {
    const tiles = new SpriteSheet(main)
    const bowTiles = new SpriteSheet(bow)

    const defaultFrame = tiles.getAnimationFramesWithKey('idle',1, 2, 3, 4)
    super(defaultFrame, NinjaAnimationDelay.idle, AnimatorMode.loop, 'ninja-animation')

    this.idle = defaultFrame
    this.crouch = tiles.getAnimationFramesWithKey('crouch',5, 6, 7, 8)
    this.slide = tiles.getAnimationFramesWithKey('crouch',25, 26, 27, 28, 29)

    this.flip = tiles.getAnimationFramesWithKey('flip',19, 20, 21, 22)
    this.fall = tiles.getAnimationFramesWithKey('fall',23, 24)
    this.touch = tiles.getAnimationFramesWithKey('touch',5, 6, 7)
    this.jump = tiles.getAnimationFramesWithKey('jump', 15, 16, 17, 18)
    this.move = tiles.getAnimationFramesWithKey('move', 9, 10, 11, 12, 13, 14)
    this.cast = tiles.getAnimationFramesWithKey('cast', 89, 90, 91, 92, 93)

    this.airSwordAttack = tiles.getAnimationFramesWithKey('air-sword-attack',
      97, 98, 99, 100, 101, 102, 103, 103, 105, 106, 107, 108, 109)

    this.swordAttack1 = tiles.getAnimationFramesWithKey('sword-attack1', 43, 44, 45, 46, 47, 48, 49)
    this.swordAttack2 = tiles.getAnimationFramesWithKey('sword-attack2', 50, 51, 52, 53)
    this.swordAttack3 = tiles.getAnimationFramesWithKey('sword-attack3', 54, 55, 56, 57, 58, 59)
    this.bowAttack = bowTiles.getAnimationFramesWithKey('bow-attack', 1, 2, 3, 4, 5, 6, 7, 8, 9)

    this.swordAttacks = [this.swordAttack1, this.swordAttack2, this.swordAttack3]
    this.attackIndex = 0

    this.longAnimation = false
    this.mob = null
    this.actionType = NinjaActionType.idling
    this.isFalling = false

    this.resetAnimation = this.resetAnimation.bind(this)
  }

  watch(mob) {
    this.mob = mob
    this.interpretator = new NinjaInterpretator(mob)
  }

  position() {
    // Размещаем изображение по центру хитбокса игрока
    const { x, y, width, height } = this.mob
    const { width: spriteWidth, height: spriteHeight } = this.animation

    const newPosition = {
      x: x + (width / 2) - (spriteWidth / 2),
      y: y + height - spriteHeight
    }

    // Зеркалим изображение в зависимости от направления игрока
    this.animation.flipped = (this.mob.directionX < 0)
    // Устанавливаем новую позицию
    this.animation.setXY(newPosition.x, newPosition.y)
  }

  isInterrupted() {
    return this.interpretator.isCrouching()
          || this.interpretator.isJumping()
          || this.interpretator.isFalling()
          || (this.actionType === NinjaActionType.casting && (this.interpretator.isBowAttacking() || this.interpretator.isSwordAttacking()))
          || (this.actionType === NinjaActionType.bowAttacking && (this.interpretator.isCasting() || this.interpretator.isSwordAttacking()))
          || (this.actionType === NinjaActionType.swordAttacking && (this.interpretator.isCasting() || this.interpretator.isBowAttacking()))
  }

  resetAnimation(key, done = false) {
    this.longAnimation = false

    let mobAction
    if (this.animation === this.bowAttack) {
      mobAction = this.mob.bowAttackAction
    } else if (this.swordAttacks.find(animation => this.animation === animation)) {
      mobAction = this.mob.swordAttackAction
    } else if (this.animation === this.cast) {
      mobAction = this.mob.castAction
    }

    if (mobAction) {
      done && mobAction.done()
      mobAction.clear()
    }
  }

  handleAnimate() {
    this.animate(this.resetAnimation)
  }

  update() {
    if (this.mob) {
      if (this.isInterrupted()) {
        this.resetAnimation()
      }

      if (this.longAnimation) {
        /**
         * Если проигрывается длинная анимация, то её можно прервать 2мя путями:
         * 1) Если игрок произвел движение влево, вправо, присел, прыжок, падение, кастует,
         * стреляет из лука (если идет анимация меча), ударяет мечом (если идет стрельба из лука) или ему нанесли урон
         * 2) Если анимация закончилась, то убираем флаг
         * */
        this.position()
        this.handleAnimate()

        return
      }

      if (this.interpretator.isSliding()) {
        // Скользим
        this.changeFrameSet(this.slide, AnimatorMode.loop, NinjaAnimationDelay.slide)
      } else if (this.interpretator.isCrouching()) {
        // Приседания
        this.changeFrameSet(this.crouch, AnimatorMode.loop, NinjaAnimationDelay.crouch)
      } else if (this.interpretator.isCasting()) {
        this.longAnimation = true
        this.actionType = NinjaActionType.casting

        // Кастуем файер
        this.changeFrameSet(this.cast, AnimatorMode.pause, NinjaAnimationDelay.cast)
      } else if (this.interpretator.isSwordAttacking()) {
        this.longAnimation = true
        this.actionType = NinjaActionType.swordAttacking

        // Атакуем мечом
        const attackAnimation = this.swordAttacks[this.attackIndex]
        this.changeFrameSet(attackAnimation, AnimatorMode.pause, NinjaAnimationDelay.sword)
        this.attackIndex ++
        if (this.attackIndex > this.swordAttacks.length - 1) {
          this.attackIndex = 0
        }
      } else if (this.interpretator.isBowAttacking()) {
        this.longAnimation = true
        this.actionType = NinjaActionType.bowAttacking

        // Стреляем из лука
        this.changeFrameSet(this.bowAttack, AnimatorMode.pause, NinjaAnimationDelay.bow)
      } else {
        if (this.interpretator.isFlipping()) {
          // Переворот в верхней точке прыжка
          this.changeFrameSet(this.flip, AnimatorMode.pause, NinjaAnimationDelay.flip)
        } else if (this.interpretator.isJumping()) {
          // Прыжок
          this.changeFrameSet(this.jump, AnimatorMode.pause, NinjaAnimationDelay.jump)
        } else if (this.interpretator.isFalling()) {
          // Падение вниз
          this.changeFrameSet(this.fall, AnimatorMode.loop, NinjaAnimationDelay.fall)
        } else if (this.interpretator.isIdling()) {
          // Ожидание
          this.changeFrameSet(this.idle, AnimatorMode.loop, NinjaAnimationDelay.idle)
        } else if (this.interpretator.isMoving()) {
          // Двигаемся
          this.changeFrameSet(this.move, AnimatorMode.loop, NinjaAnimationDelay.move)
        }
      }

      this.position()

      if (this.interpretator.isStopping()) {
        if (this.animation === this.fall) {
          // Проигрываем анимацию приземления
          this.longAnimation = true
          this.changeFrameSet(this.touch, AnimatorMode.loop, NinjaAnimationDelay.touch)
          this.position()
          this.handleAnimate()
        } else {
          // Если ускорение по X координате маленькое, то останавливаем анимацию
          this.stop()
        }
      } else {
        // Проигрываем анимацию
        this.handleAnimate()
      }
    }
  }
}