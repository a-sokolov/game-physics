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
    return this.ninja.casting
  }

  isBowAttacking() {
    return this.ninja.bowAttack
  }

  isSwordAttacking() {
    return this.ninja.swordAttack
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
    return velocityX < 1 && velocityX > 0.09
  }
}