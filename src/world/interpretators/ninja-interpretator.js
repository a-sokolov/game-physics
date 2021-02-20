export const NinjaActionType = {
  crouching: 'crouching',
  casting: 'casting',
  bowAttacking: 'bowAttacking',
  swordAttacking: 'swordAttacking',
  jumping: 'jumping',
  falling: 'falling',
  flipping: 'flipping',
  idling: 'idling',
  moving: 'moving',
  stopping: 'stopping'
}

export class NinjaInterpretator {
  constructor(ninja) {
    this.ninja = ninja
  }

  __getVelocityX() {
    return Math.abs(this.ninja.velocityX)
  }

  isCrouching() {
    return this.ninja.crouching
  }

  isCasting() {
    return this.ninja.castAction.action
  }

  isBowAttacking() {
    return this.ninja.bowAttackAction.action
  }

  isSwordAttacking() {
    return this.ninja.swordAttackAction.action
  }

  isJumping() {
    const { velocityY } = this.ninja
    return velocityY < 0 && velocityY < -17
  }

  isFalling() {
    return this.ninja.velocityY > 11
  }

  isFlipping() {
    const { velocityY } = this.ninja
    return velocityY < 0 && velocityY > -17
  }

  isIdling() {
    return !this.ninja.jumping && this.__getVelocityX() < 0.08
  }

  isMoving() {
    return !this.ninja.jumping && !(this.__getVelocityX() < 1)
  }

  isStopping() {
    const velocityX = this.__getVelocityX()
    return velocityX < 1 && velocityX > 0.095
              && !this.ninja.jumping
  }

  getActionTypes() {
    const types = []
    if (this.isFalling()) types.push(NinjaActionType.falling)
    if (this.isFlipping()) types.push(NinjaActionType.flipping)
    if (this.isJumping()) types.push(NinjaActionType.jumping)
    if (this.isCrouching()) types.push(NinjaActionType.crouching)
    if (this.isCasting()) types.push(NinjaActionType.casting)
    if (this.isBowAttacking()) types.push(NinjaActionType.bowAttacking)
    if (this.isSwordAttacking()) types.push(NinjaActionType.swordAttacking)
    if (this.isMoving()) types.push(NinjaActionType.moving)
    if (this.isStopping()) types.push(NinjaActionType.stopping)
    if (this.isIdling()) types.push(NinjaActionType.idling)

    return types
  }
}