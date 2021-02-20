import { Mob } from '../../base/mob'
import { MobAction } from '../../base/mob-action'

export class Ninja extends Mob {
  constructor(props) {
    super(props)

    this.castAction = new MobAction()
    this.swordAttackAction = new MobAction()
    this.bowAttackAction = new MobAction()
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