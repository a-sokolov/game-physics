export const CANVAS = {
  width: 1024,
  height: 640
}

export const FLOOR_Y = 10
export const JUMP_SPEED_GAP = 0.85
export const SPEED = 5.5
export const GRAVITY = 1.05
export const JUMP = 15.5

export const RICK_TILES = {
  imageName: 'rick-tiles',
  imageWidth: 512,
  imageHeight: 660,
  spriteWidth: 128,
  spriteHeight: 165,
  width: 128 / 2,
  height: 165 / 2
}

export const MORTY_TILES = {
  imageName: 'morty-tiles',
  imageWidth: 512,
  imageHeight: 660,
  spriteWidth: 128,
  spriteHeight: 165,
  width: 128 / 2,
  height: 165 / 2
}

export const MORTY_KEYMAP = new Map([
  [65, 'left'],
  [68, 'right'],
  [87, 'up'],
  [83, 'down'],
  [16, 'jump'],
])