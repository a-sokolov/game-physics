import { Scene } from '../scene'
import { Player } from './player'
import { Vector } from '../vector'

const GRAVITY = 0.85
const JUMP = 12
const SPEED = 5.5

const RICK_TILES = {
  imageName: 'rick-tiles',
  imageWidth: 512,
  imageHeight: 660,
  spriteWidth: 128,
  spriteHeight: 165,
  width: 128 / 2,
  height: 165 / 2
}

const MORTY_TILES = {
  imageName: 'morty-tiles',
  imageWidth: 512,
  imageHeight: 660,
  spriteWidth: 128,
  spriteHeight: 165,
  width: 128 / 2,
  height: 165 / 2
}

const MORTY_KEYMAP = new Map([
  [65, 'left'],
  [68, 'right'],
  [87, 'up'],
  [83, 'down'],
  [16, 'jump'],
])

export class MovementScene extends Scene {
  constructor(game) {
    super(game)

    const props = { game: this.game, speed: SPEED, gravity: GRAVITY, jump: JUMP }

    this.rick = new Player({
      ...props,
      tileProps: RICK_TILES,
      position: new Vector(30, 20)
    })
    this.morty = new Player({
      ...props,
      tileProps: MORTY_TILES,
      keymap: MORTY_KEYMAP,
      position: new Vector(this.game.screen.width - MORTY_TILES.width - 30, 20)
    })
  }

  render(time) {
    super.render(time)

    this.rick.render(time)
    this.morty.render(time)
  }
}