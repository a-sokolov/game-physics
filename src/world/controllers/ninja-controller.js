export class NinjaController {
  constructor(world, player, controller) {
    this.world = world
    this.player = player
    this.controller = controller
  }

  update() {
    // Флаг "игрок присел"
    this.player.crouch(this.controller.down.active)

    // Движение влево
    if (this.controller.left.active)  {
      this.player.moveLeft()
    }
    // Движение вправо
    if (this.controller.right.active) {
      this.player.moveRight()
    }
    // Прыжок (после, сразу деактивируем нажатие, чтобы убрать эффект "прыгаем пока зажата клавиша")
    if (this.controller.jump.active) {
      this.player.jump()
      this.controller.jump.active = false
    }
    // Швыряем файер (также деактивируем нажатие)
    if (this.controller.fire.active) {
      this.player.cast(this.world.checkFireballs.fire)
      this.controller.fire.active = false
    }
    // Удар мечом (также деактивируем нажатие)
    if (this.controller.sword.active) {
      this.player.sword()
      this.controller.sword.active = false
    }
    // Выстрел из лука (также деактивируем нажатие)
    if (this.controller.bow.active) {
      this.player.bow()
      this.controller.bow.active = false
    }
  }
}