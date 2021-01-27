export class Engine {
  constructor(timeStep, update, render) {
    this.timeStep = timeStep
    this.update = update
    this.render = render

    this.animationFrameRequest = undefined
    this.accumulatedTime = 0
    this.time = undefined
    this.updated = false

    this.handleRun = this.handleRun.bind(this)
  }

  run(time) {
    this.accumulatedTime += time - this.time
    this.time = time

    if (this.accumulatedTime >= this.timeStep * 3) {
      this.accumulatedTime = this.timeStep
    }

    while (this.accumulatedTime >= this.timeStep) {
      this.accumulatedTime -= this.timeStep
      this.update(time)
      this.updated = true
    }

    if (this.updated) {
      this.updated = false
      this.render(time)
    }

    this.animationFrameRequest = requestAnimationFrame(this.handleRun)
  }

  handleRun(time) {
    this.run(time)
  }

  start() {
    this.accumulatedTime = this.timeStep
    this.time = window.performance.now()
    this.animationFrameRequest = requestAnimationFrame(this.handleRun)
  }

  stop() {
    cancelAnimationFrame(this.animationFrameRequest)
  }
}