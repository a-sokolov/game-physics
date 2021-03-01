import { EnemyAnimation } from './animation/enemy-animation'
import { EnemyType } from './constants'
import { ObjectsFactory } from './objects/objects-factory'

export class Enemies {
  constructor(env) {
    this.env = env
  }

  init(list) {
    this.enemyAnimations = list.map(enemy => {
      const { x, y, type } = enemy

      const enemyType = EnemyType[type]
      const animation  = new EnemyAnimation(enemyType)
      const mob = ObjectsFactory.createEnemy(x, y, enemyType.props)

      mob.directionX = -1
      animation.watch(mob)
      this.env.addMob(mob)
      return animation
    })

  }

  update() {
    this.enemyAnimations.forEach(enemy => enemy.update())
  }
}