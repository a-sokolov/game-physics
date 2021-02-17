export class Environment {
  constructor(friction, gravity, limitRect) {
    this.friction = friction
    this.gravity = gravity
    this.limitRect = limitRect

    this.mobs = []
    this.mobsCollisioRects = new Map()
    this.collider = null
  }

  setCollider(collider) {
    this.collider = collider
  }

  addMob(...mob) {
    this.mobs = this.mobs.concat(mob)
  }

  removeMob(mob) {
    this.mobs = this.mobs.filter(toRemove => !toRemove === mob)
  }

  getMobCollisionRects(mob) {
    return this.mobsCollisioRects.get(mob)
  }

  getAllCollisionRects() {
    let allRects = []
    for (const rects of this.mobsCollisioRects.values()) {
      allRects = allRects.concat(rects)
    }
    return allRects
  }

  collideMob(mob, limitRect) {
    if (mob.getLeft() < 0) {
      mob.setLeft(0)
      mob.velocityX = 0
    } else if (mob.getRight() > limitRect.width) {
      mob.setRight(limitRect.width)
      mob.velocityX = 0
    }

    // if (mob.getTop() < 0) {
    //   mob.setTop(0)
    //   mob.velocityY = 0
    // } else if (mob.getBottom() > limitRect.height) {
    //   mob.setBottom(limitRect.height)
    //   mob.velocityY = 0
    //   mob.jumping = false
    // }

    this.mobsCollisioRects.set(mob, this.collider.collideObject(mob))
  }

  update() {
    this.mobsCollisioRects.clear()

    this.mobs.forEach(mob => {
      mob.velocityY += this.gravity
      mob.updatePosition(this.gravity, this.friction)
      this.collideMob(mob, this.limitRect)
    })
  }
}