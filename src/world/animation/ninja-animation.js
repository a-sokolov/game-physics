import { SpriteSheet } from '../../graphic/sprite-sheet'
import { Animator, AnimatorMode } from '../../graphic/animator'
import { NinjaActionType, NinjaInterpretator } from '../interpretators/ninja-interpretator'
import { AnimationSets } from '../../graphic/animation-sets'
import { CollisionType } from '../collider'

export const NinjaAnimationDelay = {
  idle: 4,
  crouch: 4,
  slide: 2,
  cast: 2,
  sword: 2,
  airSword: 1,
  bow: 3,
  airBow: 1,
  flip: 2,
  jump: 1,
  fall: 2,
  touch: 3,
  move: 3,
  getOrRemoveSword: 3
}

/** Здесь определяем анимацию персонажа в зависимости от его координат и скоростей */
export class NinjaAnimation extends Animator {
  constructor({ main, bow, sword }) {
    const tiles = new SpriteSheet(main)
    const bowTiles = new SpriteSheet(bow)
    const swordTiles = new SpriteSheet(sword)

    const defaultFrame = tiles.getAnimationFramesWithKey('idle',1, 2, 3, 4)
    super(defaultFrame, NinjaAnimationDelay.idle, AnimatorMode.loop, 'ninja-animation')

    this.idle = defaultFrame
    this.armedIdle = tiles.getAnimationFramesWithKey('armed-idle',39, 40, 41, 42)
    this.crouch = tiles.getAnimationFramesWithKey('crouch',5, 6, 7, 8)
    this.slide = tiles.getAnimationFramesWithKey('slide',25, 26, 27, 28, 29)

    this.flip = tiles.getAnimationFramesWithKey('flip',19, 20, 21, 22)
    this.fall = tiles.getAnimationFramesWithKey('fall',23, 24)
    this.touch = tiles.getAnimationFramesWithKey('touch',5, 6, 7)
    this.jump = tiles.getAnimationFramesWithKey('jump', 15, 16, 17, 18)
    this.move = tiles.getAnimationFramesWithKey('move', 9, 10, 11, 12, 13, 14)
    this.armedMove = swordTiles.getAnimationFramesWithKey('armed-move', 1, 2, 3, 4, 5, 6)
    this.cast = tiles.getAnimationFramesWithKey('cast', 86, 87, 88, 89, 90, 91, 92, 93)

    this.getSword = tiles.getAnimationFramesWithKey('get-sword', 86, 87, 88, 89, 90, 91, 92, 93)
    this.removeSword = tiles.getAnimationFramesWithKey('remove-sword', 74, 75, 76, 77)

    this.airSwordAttacks = new AnimationSets([
      tiles.getAnimationFramesWithKey('air-sword-attack1', 97, 98, 99, 100),
      tiles.getAnimationFramesWithKey('air-sword-attack2', 101, 102, 103, 104),
      tiles.getAnimationFramesWithKey('air-sword-attack3', 105, 106, 107, 108, 109)
    ])

    this.swordAttacks = new AnimationSets([
      tiles.getAnimationFramesWithKey('sword-attack1', 43, 44, 45, 46, 47, 48, 49),
      tiles.getAnimationFramesWithKey('sword-attack2', 50, 51, 52, 53),
      tiles.getAnimationFramesWithKey('sword-attack3', 54, 55, 56, 57, 58, 59)
    ])

    this.bowAttack = bowTiles.getAnimationFramesWithKey('bow-attack', 1, 2, 3, 4, 5, 6, 7, 8, 9)
    this.airBowAttack = bowTiles.getAnimationFramesWithKey('air-bow-attack', 10, 11, 12, 13, 14, 15)

    this.longAnimation = false
    this.mob = null
    this.controller = null

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

  isGroundAttack() {
    return this.animation === this.bowAttack
        || this.swordAttacks.equals(this.animation)
        || this.isActionType(NinjaActionType.casting)
  }

  isAirAttack() {
    return this.animation === this.airBowAttack
        || this.airSwordAttacks.equals(this.animation)
  }

  isCollisionType(type) {
    return this.mob.collisions.filter(collision => collision === type).length > 0
  }

  isCollisionTypes(types) {
    return this.mob.collisions.filter(collision => types.some(type => type === collision)).length > 0
  }

  isInterrupted() {
    return this.interpretator.isCrouching()
          || (this.isActionType(NinjaActionType.casting) && (this.interpretator.isBowAttacking() || this.interpretator.isSwordAttacking()))
          || (this.isActionType(NinjaActionType.bowAttacking) && (this.interpretator.isCasting() || this.interpretator.isSwordAttacking()))
          || (this.isActionType(NinjaActionType.swordAttacking) && (this.interpretator.isCasting() || this.interpretator.isBowAttacking()))
          || ((this.mob.jumping || this.isCollisionTypes([CollisionType.left, CollisionType.right])) && this.isGroundAttack())
          || (this.isCollisionTypes([CollisionType.top, CollisionType.bottom]) && this.isAirAttack())
  }

  checkController() {
    if (this.interpretator.isMoving() && this.isGroundAttack()) {
      // Останавливаем движение игрока, если во время оного произведен выстрел из лука, каст файера или удар мячом
      if (this.mob.directionX < 0) {
        this.controller.left.active = false
      } else {
        this.controller.right.active = false
      }
    }
  }

  resetAnimation(key, done = false) {
    this.longAnimation = false

    let mobAction
    if (this.isActionType(NinjaActionType.bowAttacking)) {
      mobAction = this.mob.bowAttackAction
    } else if (this.isActionType(NinjaActionType.swordAttacking)) {
      mobAction = this.mob.swordAttackAction
    } else if (this.isActionType(NinjaActionType.casting)) {
      mobAction = this.mob.castAction
    }

    if (mobAction) {
      done && mobAction.done()
      mobAction.clear()

      // Возвращаем обратно возможность движения не отпуская клавиши
      if (this.mob.directionX < 0) {
        this.controller.left.active = this.controller.left.down
      } else {
        this.controller.right.active = this.controller.right.down
      }

      this.played = false
    }
  }

  handleAnimate() {
    this.animate(this.resetAnimation)
  }

  isActionType(type) {
    switch (type) {
      case NinjaActionType.falling:
        return this.animation === this.fall
      case NinjaActionType.jumping:
        return this.animation === this.jump
      case NinjaActionType.flipping:
        return this.animation === this.flip
      case NinjaActionType.crouching:
        return this.animation === this.crouch
      case NinjaActionType.sliding:
        return this.animation === this.slide
      case NinjaActionType.moving:
        return this.animation === this.move
            || this.animation === this.armedMove
      case NinjaActionType.bowAttacking:
        return this.animation === this.bowAttack
            || this.animation === this.airBowAttack
      case NinjaActionType.swordAttacking:
        return this.swordAttacks.equals(this.animation)
            || this.airSwordAttacks.equals(this.animation)
      case NinjaActionType.idling:
        return this.animation === this.idle
            || this.animation === this.armedIdle
      case NinjaActionType.casting:
        return this.animation === this.cast
    }

    return false
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
        this.checkController()
        this.position()
        this.handleAnimate()

        return
      }

      if (!this.mob.jumping) {
        // Если прыжок закончился, то сбрасываем анимацию удара мечом в воздухе до первого сета
        this.airSwordAttacks.reset()
      }

      if (!this.mob.isArmed && this.animation === this.armedIdle) {
        this.longAnimation = true
        // Убираем меч
        this.changeFrameSet(this.removeSword, AnimatorMode.pause, NinjaAnimationDelay.getOrRemoveSword)
      } else if (this.interpretator.isSliding()) {
        // Скользим
        this.changeFrameSet(this.slide, AnimatorMode.pause, NinjaAnimationDelay.slide)
      } else if (this.interpretator.isCrouching()) {
        // Приседания
        this.changeFrameSet(this.crouch, AnimatorMode.loop, NinjaAnimationDelay.crouch)
      } else if (this.interpretator.isCasting()) {
        this.longAnimation = true

        // Кастуем файер
        this.changeFrameSet(this.cast, AnimatorMode.pause, NinjaAnimationDelay.cast)
      } else if (this.interpretator.isSwordAttacking()) {
        this.longAnimation = true

        // Атакуем мечом
        if (this.mob.jumping) {
          this.changeFrameSet(this.airSwordAttacks.next(), AnimatorMode.pause, NinjaAnimationDelay.airSword)
        } else {
          this.changeFrameSet(this.swordAttacks.next(), AnimatorMode.pause, NinjaAnimationDelay.sword)
        }
      } else if (this.interpretator.isBowAttacking()) {
        this.longAnimation = true

        // Стреляем из лука
        if (this.mob.jumping) {
          this.changeFrameSet(this.airBowAttack, AnimatorMode.pause, NinjaAnimationDelay.airBow)
        } else {
          this.changeFrameSet(this.bowAttack, AnimatorMode.pause, NinjaAnimationDelay.bow)
        }
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
        } else if (this.interpretator.isIdling()
              || (this.interpretator.isStopping() && !this.isActionType(NinjaActionType.falling))) {
          // Ожидание по триггеру "ожидание" и когда скорость почти упала
          // Это нужно для того, чтобы не было дубля анимации, если в этом время производилась быстрая атака
          if (this.mob.isArmed) {
            this.changeFrameSet(this.armedIdle, AnimatorMode.loop, NinjaAnimationDelay.idle)
          } else {
            this.changeFrameSet(this.idle, AnimatorMode.loop, NinjaAnimationDelay.idle)
          }
        } else if (this.interpretator.isMoving()) {
          // Двигаемся
          if (this.mob.isArmed) {
            this.changeFrameSet(this.armedMove, AnimatorMode.loop, NinjaAnimationDelay.move)
          } else {
            this.changeFrameSet(this.move, AnimatorMode.loop, NinjaAnimationDelay.move)
          }
        }
      }

      this.position()

      const isFallingOrAirAttack = this.isActionType(NinjaActionType.falling) || this.isAirAttack()
      if (this.interpretator.isStopping() && (isFallingOrAirAttack || this.isActionType(NinjaActionType.moving))) {
        // Это блок, когда игрок скорость игрока "почти" останавливается

        if (isFallingOrAirAttack) {
          // Проигрываем анимацию приземления: когда просто падаем или производим "воздушную атаку"
          this.longAnimation = true
          this.changeFrameSet(this.touch, AnimatorMode.loop, NinjaAnimationDelay.touch)
          this.position()
          this.handleAnimate()
        } else if (this.isGroundAttack()) {
          // Если производится атака, то даем ей завершиться
          this.handleAnimate()
        } else {
          // Если ускорение по X координате маленькое,
          // то останавливаем анимацию, т.е. не проигрываем следующий кадр
          this.stop()
        }
      } else {
        // Проигрываем анимацию
        this.handleAnimate()
      }

      this.checkController()
    }
  }
}