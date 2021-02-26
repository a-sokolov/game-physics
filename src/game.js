import { World } from './world/world'

export class Game {
  constructor() {
    this.world = new World()
  }

  update(time) {
    this.world.update(time)
    this.world.level.parallaxes.forEach(parallax => parallax.update())
  }
}