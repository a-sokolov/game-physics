export const MobStatus = {
  idling: 'idling',
  patrolling: 'patrolling',
  attacking: 'attacking',
}

export class DummyBehavior {
  constructor(mob, screenRect, limitRect) {
    this.mob = mob
    this.screenRect = screenRect
    this.limitRect = limitRect

    this.player = null
    this.mobStatus = MobStatus.idling
    this.lastMobStatus = null

    this.time = window.performance.now()
  }

  watch(player) {
    this.player = player
  }

  check() {
    this.lastMobStatus = this.mobStatus
    const playerVisible = false

    if (playerVisible) {
      this.mobStatus = MobStatus.attacking
    } else {

    }
  }

  update() {
    const timePast = Math.round(window.performance.now() - this.time)

    this.check()

    // console.log('Time past is', timePast)

    switch (this.mobStatus) {
      case MobStatus.idling:
        break
      case MobStatus.patrolling:
        break
      case MobStatus.attacking:
        break
    }
  }
}