import { Direction } from '../graphic/parallax-image'
import {AnimatorMode} from "../graphic/animator";

export class BackgroundController {
  constructor({ background, camera, screenRect, edgeRect, limitRect }) {
    this.background = background
    this.camera = camera

    this.screenRect = screenRect
    this.edgeRect = edgeRect
    this.limitRect = limitRect

    this.maxViewPortalX = this.limitRect.width - this.screenRect.width + this.edgeRect.x + this.edgeRect.width

    this.player = null
  }

  watch(player) {
    this.player = player
  }

  update() {
    if (this.player) {
      const x1 = this.edgeRect.x + Math.round(this.camera.x) + 0.5
      // const y1 = this.edgeRect.y + this.camera.y + 0.01

      const x2 = this.edgeRect.x + Math.round(this.camera.x) + this.edgeRect.width - 0.5
      // const y2 = this.edgeRect.y + this.camera.y + this.edgeRect.height - 0.01

      // if ((Math.round(this.object.x) > x1 && Math.round(this.object.x) + this.object.width < x2)
      //   || (Math.round(this.object.x) < this.edgeRect.x)
      //   || (this.limitRect.width === this.screenRect.width)
      //   || (this.maxViewPortalX < (Math.round(this.object.x) + this.object.width))) {
      //   // Когда объект выходит за рамки viewport'а, то останавливаем анимацию
      //   this.background.stop()
      // } else if (this.object.oldX) {
      //   if (this.object.oldX === this.object.x) {
      //     // Если нет движения, то останавливаем анимацию
      //     this.background.stop()
      //   }
      //   if (this.object.oldX > this.object.x) {
      //     // Если объект дальше последней точки, то двигаем вперед
      //     this.background.run(Direction.backward)
      //   }
      //   if (this.object.oldX < this.object.x) {
      //     // Если объект находится до последней точки, то двигаем назад
      //     this.background.run(Direction.forward)
      //   }
      // }

      const roundedVelocityX = Math.trunc(Math.abs(this.player.velocityX))

      // console.log(this.player.velocityX, this.background.speed)

      if ((this.player.x > x1 && this.player.x + this.player.width < x2)
        || (this.player.x < this.edgeRect.x)
        || (this.limitRect.width === this.screenRect.width)
        || (this.maxViewPortalX < (this.player.x + this.player.width))
        || Math.abs(this.player.velocityX) < this.background.speed) {
        // Когда объект выходит за рамки viewport'а, то останавливаем анимацию
        this.background.stop()
      } else if (this.player.velocityY < 0) {
        if (roundedVelocityX === 0) {
          this.background.stop()
        } else if (this.player.directionX < 0) {
          this.background.run(Direction.backward)
        } else {
          this.background.run(Direction.forward)
        }
      } else if (roundedVelocityX === 0) {
        this.background.stop()
      } else if (this.player.directionX < 0) {
        if (this.player.velocityX < -0.1) {
          this.background.run(Direction.backward)
        } else {
          this.background.run(Direction.backward)
        }
      } else if (this.player.directionX > 0) {
        if (this.player.velocityX > 0.1) {
          this.background.run(Direction.forward)
        } else {
          this.background.run(Direction.forward)
        }
      }

      this.background.update()
    }
  }
}