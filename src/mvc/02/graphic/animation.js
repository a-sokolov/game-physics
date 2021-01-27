import { Sprite } from './sprite'

export class Animation extends Sprite {
  constructor({ name, frames, speed, repeat = true, autorun = true, width, height }) {
    super({
      name,
      sourceX: frames[0].sx,
      sourceY: frames[0].sy,
      width,
      height
    })

    this.frames = frames
    this.speed = speed
    this.repeat = repeat
    this.running = autorun
    this.lastTime = 0
    this.currentFrame = 0
    this.totalFrames = this.frames.length
  }

  setSpeed(speed) {
    this.speed = speed
  }

  setFrame(index) {
    this.currentFrame = index
    this.sourceX = this.frames[index].sx
    this.sourceY = this.frames[index].sy
  }

  run() {
    this.setFrame(0)
    this.lastTime = 0
    this.running = true
  }

  stop() {
    this.running = false
  }

  nextFrame() {
    if ((this.currentFrame + 1) === this.totalFrames) {
      // Последний кадр
      if (this.repeat) {
        // Если флаг "автоповтор", то запускаем первый кадр
        this.setFrame(0)
        return
      }
      // Останавливаем анимацию
      this.stop()
      return
    }
    // Устанавливаем следующий кадр анимации
    this.setFrame(this.currentFrame + 1)
  }

  update(time) {
    if (!this.running) {
      return
    }

    // Если пришло время обновления анимации, то запускаем следующий кадр
    if ((time - this.lastTime) >= this.speed) {
      this.nextFrame()
      this.lastTime = time
    }
  }
}