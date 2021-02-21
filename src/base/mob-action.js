export class MobAction {
  constructor(key, callback) {
    this.canDoAction = true
    this.action = false
    this.key = key
    this.callback = callback
  }

  fire() {
    if (this.canDoAction) {
      console.log('Action fired', this.key)
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
      console.log('Action done', this.key)
    }
  }
}