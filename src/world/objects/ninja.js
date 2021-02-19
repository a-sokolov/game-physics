import { Mob } from '../../base/mob'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.casting = false
    this.arrowAttack = false
    this.swordAttack = false
  }

  sword() {
    if (!this.swordAttack) {
      this.swordAttack = true
      setTimeout(() => this.swordAttack = false, 300)
    }
  }

  bow() {

  }
}