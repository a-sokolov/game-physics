export const AnimatorMode = {
  pause: 'pause',
  loop: 'loop'
}

export class Animator {
  constructor(animation, delay, mode = AnimatorMode.pause) {
    this.count = 0
    this.delay = (delay >= 1) ? delay : 1
    this.animation = animation
    this.frameIndex = 0
    this.mode = mode

    this.stopAnimation = false
    this.playing = false
  }

  animate(callback) {
    if (!this.playing) {
      try {
        this.playing = true
        this.loop(callback)
      } finally {
        this.playing = false
      }
    }
  }

  changeFrameSet(animation, mode, delay = 10, frameIndex = 0) {
    if (this.animation === animation) {
      return
    }

    this.count = 0
    this.delay = delay
    this.animation = animation
    this.frameIndex = frameIndex
    this.animation.setFrame(frameIndex)
    this.mode = mode
  }

  stop() {
    this.stopAnimation = true
  }

  loop(callback) {
    this.count ++

    while(this.count > this.delay) {
      this.count -= this.delay

      switch(this.mode) {
        case AnimatorMode.loop:
          this.frameIndex = (this.frameIndex < this.animation.frames.length - 1)
                              ? this.frameIndex + 1
                              : 0
          break
        case AnimatorMode.pause:
          this.frameIndex = (this.frameIndex < this.animation.frames.length - 1)
                              ? this.frameIndex + 1
                              : this.frameIndex
          break
      }

      this.animation.setFrame(this.frameIndex)
      if (callback && this.frameIndex === this.animation.frames.length - 1) {
        callback(true)
      }
      if (this.stopAnimation
        || this.mode === AnimatorMode.pause
        && this.frameIndex === this.animation.frames.length - 1) {
        this.stopAnimation = false
        break
      }
    }
  }
}