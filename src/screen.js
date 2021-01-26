import { ImageLoader } from './loaders/image-loader'
import { Rect } from './shapes/rect'

export class Screen {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.canvas = this.createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
    this.images = {}
    this.isImagesLoaded = false

    this.camera = null
    this.isCameraSet = false

    this.objects = []
  }

  createCanvas(width, height) {
    const root = document.getElementById('container')
    const elements = root.getElementsByTagName('canvas')
    if (elements.length) {
      // Если нашли ранее созданный, то возвращаем его
      return elements[0]
    }

    // Создаем "холст" и инициализируем его
    const canvas = document.createElement('canvas')
    root.appendChild(canvas)

    canvas.width = width
    canvas.height = height

    return canvas
  }

  setCamera(camera) {
    this.camera = camera
    this.isCameraSet = true
  }

  loadImages(imageFiles) {
    const loader = new ImageLoader(imageFiles)
    loader.load().then(names => {
      this.images = Object.assign(this.images, loader.images)
      this.isImagesLoaded = true
      console.log(names)
    })
  }

  drawSprite(sprite, width, height, showRect = true) {
    const image = this.images[sprite.imageName]

    let spriteX = sprite.x
    let spriteY = sprite.y

    if (this.isCameraSet) {
      spriteX -= this.camera.position.x
      spriteY -= this.camera.position.y
    }

    if (!this.isNeedDraw({
                  name: sprite.imageName,
                  x: spriteX,
                  y: spriteY,
                  originX: sprite.x,
                  originY: sprite.y,
                  width: width || sprite.width,
                  height: height || sprite.height })) {
      return
    }

    this.context.drawImage(image,
      sprite.sourceX,
      sprite.sourceY,
      sprite.width,
      sprite.height,
      spriteX,
      spriteY,
      width || sprite.width,
      height || sprite.height)

    if (showRect) {
      this.drawStroke(new Rect(sprite.x, sprite.y, width || sprite.width, height || sprite.height))
    }
  }

  drawParallaxImage(parallaxImage) {
    parallaxImage.images.forEach(img => this.drawImg(img))
  }

  drawImg(img) {
    if (!this.isNeedDraw(img)) {
      return
    }

    const image = this.images[img.imageName]
    this.context.drawImage(image,
      img.x,
      img.y,
      img.width,
      img.height)
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  fill(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.width, this.height)
  }

  drawCircle(circle, color) {
    this.context.fillStyle = color
    this.context.beginPath()
    this.context.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, false)
    this.context.closePath()
    this.context.fill()
  }

  drawRect(rect, color) {
    this.context.fillStyle = color
    this.context.fillRect(rect.position.x, rect.position.y, rect.width, rect.height)
  }

  drawStroke(rect, color, withCamera = true) {
    this.context.strokeStyle = color

    let x = rect.position.x
    let y = rect.position.y

    if (this.isCameraSet && withCamera) {
      x -= this.camera.position.x
      y -= this.camera.position.y
    }

    if (!this.isNeedDraw({ ...rect, x, y })) {
      return
    }

    this.context.strokeRect(x, y, rect.width, rect.height)
  }

  drawImage(name, x, y, width, height) {
    const image = this.images[name]
    this.context.drawImage(image, x, y, width, height)
  }

  isNeedDraw({ name, x, y, width, height, originX, originY }) {
    const visible = !((x >= this.width) ||
      (y >= this.height) ||
      ((x + width) <= 0) ||
      ((y + height) <= 0))

    if (name && name === 'brick') {
      const rect = new Rect(originX, originY, width, height)
      let img = this.objects.find(img => img.rect.equals(rect) && img.name === name)

      if (!img) {
        img = { name, rect, visible }
        this.objects.push(img)
      }
      if (img.visible !== visible) {
        // console.log(`${img.name} (${img.rect.position.x}:${img.rect.position.y})`, visible)
      }
      img.visible = visible
    }

    return visible
  }
}