export const AnimatorMode = {
  pause: 'pause',
  loop: 'loop'
}

export class Animator {
  constructor(animation, delay, mode = AnimatorMode.pause, key) {
    this.count = 0
    this.delay = (delay >= 1) ? delay : 1
    this.animation = animation
    this.frameIndex = 0
    this.mode = mode

    this.stopAnimation = false
    this.playing = false
    this.key = key
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

  isEnded() {
    return this.frameIndex === this.animation.frames.length - 1
  }

  loop(callback) {
    this.count ++

    while(this.count > this.delay) {
      this.count -= this.delay
      this.frameIndex ++

      switch(this.mode) {
        case AnimatorMode.loop:
          if (this.frameIndex === this.animation.frames.length) {
            this.frameIndex = 0
          }
          break
        case AnimatorMode.pause:
          if (this.frameIndex === this.animation.frames.length) {
            this.frameIndex = this.animation.frames.length - 1
          }
          break
      }

      this.animation.setFrame(this.frameIndex)
      if (callback && this.isEnded()) {
        // Когда закончилась анимация, то вызываем колбэк
        callback(this.animation.key, true)
      }
      if (this.stopAnimation || this.mode === AnimatorMode.pause && this.isEnded()) {
        if (this.mode === AnimatorMode.pause && this.isEnded()) {
          this.frameIndex = 0
        }
        // Если анимацию остановили или в режиме "пауза" дошли до последнего кадра
        this.stopAnimation = false
        break
      }
    }
  }
}