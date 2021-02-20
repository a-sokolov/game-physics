export class MobAction {
  constructor(callback) {
    this.canDoAction = true
    this.action = false
    this.callback = callback
  }

  fire() {
    if (this.canDoAction) {
      this.canDoAction = false
      this.action = true
    }
  }

  clear() {
    this.canDoAction = true
    this.action = false
  }

  done() {
    if (this.action) {
      this.action = false
      this.callback?.()
    }
  }
}