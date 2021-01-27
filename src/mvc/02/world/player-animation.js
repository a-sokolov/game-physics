import { SpriteSheet } from '../graphic/sprite-sheet'

export class PlayerAnimation {
  constructor(tileProps, speed) {
    const tiles = new SpriteSheet(tileProps)

    this.speed = speed
    this.stop = tiles.getAnimation([1])
    this.jump = tiles.getAnimation([9])
    this.left = tiles.getAnimation([8])
    this.right = tiles.getAnimation([13])

    this.jumpLeft = tiles.getAnimation([6])
    this.jumpRight = tiles.getAnimation([15])

    this.moveUp = tiles.getAnimation([9, 10, 11, 12], speed)
    this.moveDown = tiles.getAnimation([1, 2, 3, 4], speed)
    this.moveLeft = tiles.getAnimation([5, 6, 7, 8], speed)
    this.moveRight = tiles.getAnimation([13, 14, 15, 16], speed)

    this.x = 0
    this.y = 0
    this.current = this.stop
    this.player = null
  }

  watch(player) {
    this.player = player
    this.x = player.x
    this.y = player.y
  }

  update(time) {
    if (this.player) {
      const playerX = this.player.x
      const currentX = this.x

      let speed = this.speed
      if (playerX > currentX) {
        // move right
        this.current = this.player.jumping ? this.jumpRight : this.moveRight
      } else if (currentX > playerX) {
        // move left
        this.current = this.player.jumping ? this.jumpLeft : this.moveLeft
      }

      if (playerX === 0 || playerX === currentX) {
        // stop
        this.current = this.stop
      } else {
        const distance = Math.abs(playerX - currentX)
        if (distance < this.player.speed) {
          const slowDown = (this.speed * (( (this.player.speed - distance) / (this.player.speed / 100) ) / 100))
          speed = this.speed + slowDown
          if (this.player.speed / 2 < slowDown) {
            this.current = this.current === this.moveLeft ? this.left : this.right
          }
        }
      }

      this.x = this.player.x
      this.y = this.player.y

      this.current.setSpeed(speed)
      this.current.update(time)
    }
  }
}