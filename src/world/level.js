import { Rect } from '../base/rect'
import { Img } from '../graphic/img'

export class Level {
  constructor(key, map, spriteSheet) {
    this.key = key
    this.map = map
    this.spriteSheet = spriteSheet
    this.tileMap = {
      rows: map.height,
      columns: map.width,
      size: {
        width: map.tilewidth,
        height: map.tileheight
      }
    }

    const hitBoxes = map.layers.find(({ name }) => name === 'collisions')
    const levelBoxes = map.layers.find(({ name }) => name === 'level')
    this.playerPosition = levelBoxes.objects.find(({ name }) => name === 'player')

    this.collisionMap = [...Array.from({ length: this.tileMap.rows * this.tileMap.columns }).map(() => 0)]

    hitBoxes.objects.forEach(({ type, x, y, width, height }) => {
      const value = parseInt(type, 10)
      if (value) {
        let startX = x
        let startY = y
        const rows = height / this.tileMap.size.height
        const columns = width / this.tileMap.size.width

        for (let i = 1; i <= rows * columns; i ++) {
          const index = (startY / this.tileMap.size.height) * this.tileMap.columns + (startX / this.tileMap.size.width)
          this.collisionMap[index] = value

          startX += this.tileMap.size.width

          if (i % columns === 0) {
            startY += this.tileMap.size.height
            startX = x
          }
        }
      }
    })

    this.collisionRects = []
    this.staticAnimations = []

    const cameraTrap = levelBoxes.objects.find(({ name }) => name === 'camera-trap')
    const screen = levelBoxes.objects.find(({ name }) => name === 'screen')

    this.cameraTrap = new Rect(cameraTrap.x, cameraTrap.y, cameraTrap.width, cameraTrap.height)
    this.screenRect = new Rect(0, 0, screen.width, screen.height)
    this.limitRect = new Rect(0, 0, map.width * map.tilewidth, map.height * map.tileheight)

    this.levelSprite = null
    this.beforeSprite = null
    this.images = []
  }

  createImages(display) {
    //
  }

  addImage(name, x, y, width, height) {
    this.images.push(new Img({ name, x, y, width, height }))
  }

  addStaticAnimation(animation) {
    this.staticAnimations.push(animation)
  }

  update() {
    this.staticAnimations.forEach(staticAnimation => staticAnimation.update())
  }
}