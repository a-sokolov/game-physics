import { Mob } from '../../base/mob'
import { MobAction } from '../../base/mob-action'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.castAction = new MobAction('cast')
    this.swordAttackAction = new MobAction('sword-attack')
    this.bowAttackAction = new MobAction('bow-attack')

    this.isSwordTakenOut = false
    this.timer = 0
  }

  cast() {
    if (!this.jumping) {
      this.castAction.fire()
    }
  }

  sword() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.isSwordTakenOut = true
    this.swordAttackAction.fire()
    this.timer = setTimeout(() => this.isSwordTakenOut = false, 10000)
  }

  bow() {
    this.bowAttackAction.fire()
  }
}