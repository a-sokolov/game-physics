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
    this.key = key
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
    this.played = false
  }

  stop() {
    this.stopAnimation = true
  }

  isEnded() {
    return this.frameIndex === this.animation.frames.length - 1
  }

  animate(callback) {
    if (this.mode === AnimatorMode.pause && this.played) {
      // Если в режиме пауза и анимация уже проиграна, что выходим
      return
    }

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

      let animationEnded = this.isEnded()
      if (this.stopAnimation || this.mode === AnimatorMode.pause && animationEnded) {
        if (this.mode === AnimatorMode.pause && animationEnded) {
          this.played = true
          this.frameIndex = 0
        }
        // Если анимацию остановили или в режиме "пауза" дошли до последнего кадра
        this.stopAnimation = false

        // Когда закончилась анимация, то вызываем колбэк
        callback?.(this.animation.key, animationEnded)

        break
      } else if (callback && animationEnded) {
        // Когда закончилась анимация, то вызываем колбэк
        callback(this.animation.key, true)
      }
    }
  }
}