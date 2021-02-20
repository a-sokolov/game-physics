import { Mob } from '../../base/mob'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.casting = false
    this.swordAttacking = false
    this.bowAttacking = false

    this.canCast = true
    this.canBowAttack = true
    this.canSwordAttack = true
  }

  cast(callback) {
    if (this.canCast) {
      this.canCast = false
      this.casting = true
    }
  }

  sword(callback) {
    if (this.canSwordAttack) {
      this.canSwordAttack = false
      this.swordAttacking = true
    }
  }

  bow(callback) {
    if (this.canBowAttack) {
      this.canBowAttack = false
      this.bowAttacking = true
    }
  }
}