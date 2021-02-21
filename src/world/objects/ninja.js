import { Mob } from '../../base/mob'
import { MobAction } from '../../base/mob-action'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.castAction = new MobAction('cast')
    this.swordAttackAction = new MobAction('sword-attack')
    this.bowAttackAction = new MobAction('bow-attack')
  }

  cast() {
    this.castAction.fire()
  }

  sword() {
    this.swordAttackAction.fire()
  }

  bow() {
    this.bowAttackAction.fire()
  }
}