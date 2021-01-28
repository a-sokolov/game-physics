export const AnimatorMode = {
  pause: 'pause',
  loop: 'loop'
}

export class Animator {
  constructor(animation, delay) {
    this.count = 0
    this.delay = (delay >= 1) ? delay : 1
    this.animation = animation
    this.frameIndex = 0
    // this.frameValue = animation.frames[0]
    this.mode = AnimatorMode.pause
  }

  animate() {
    switch(this.mode) {
      case AnimatorMode.loop:
        this.loop()
        break
      case AnimatorMode.pause:
        break
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
    // this.frameValue = animation.frames[frameIndex]
    this.mode = mode
  }

  loop() {
    this.count ++

    while(this.count > this.delay) {
      this.count -= this.delay
      this.frameIndex = (this.frameIndex < this.animation.frames.length - 1) ? this.frameIndex + 1 : 0
      this.animation.setFrame(this.frameIndex)
      // this.frameValue = this.animation.frames[this.frameIndex]
    }
  }
}