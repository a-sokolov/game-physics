import { World } from './world/world'

export class Game {
  constructor() {
    this.world = new World(0.9, 3)
  }

  update() {
    this.world.update()
  }
}