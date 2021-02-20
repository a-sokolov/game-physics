import { Mob } from '../../base/mob'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.casting = false
    this.bowAttack = false
    this.swordAttack = false
  }

  sword() {
    if (!this.swordAttack) {
      this.swordAttack = true
      setTimeout(() => this.swordAttack = false, 200)
    }
  }

  bow() {
    if (!this.bowAttack) {
      this.bowAttack = true
      setTimeout(() => this.bowAttack = false, 400)
    }
  }
}