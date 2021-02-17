import { Vector } from './vector'

export class ShapeCollision {
  constructor(screen, delta) {
    this.screen = screen
    this.delta = delta
  }

  collision(shapes) {
    for (let i = 0; i < shapes.length; i ++) {
      for (let j = i + 1; j < shapes.length; j ++) {
        const circle1 = shapes[i].mob
        const circle2 = shapes[j].mob

        // Считаем новую позицию с учетом вектора ускорения
        const newPosition1 = circle1.position.add(circle1.velocity.multiply(this.delta))
        const newPosition2 = circle2.position.add(circle2.velocity.multiply(this.delta))
        // Вычисляем расстоянием между вектора
        const distance = newPosition1.distanceFrom(newPosition2)
        // Если расстояние меньше суммы радиусов, то мы получаем коллизию 2х кругов
        if (distance <= circle1.radius + circle2.radius) {
          let power = (Math.abs(circle1.velocity.x) + Math.abs(circle1.velocity.y)) +
            (Math.abs(circle2.velocity.x) + Math.abs(circle2.velocity.y))
          // power *= 0.00482
          power = 1

          const opposite = circle1.position.y - circle2.position.y
          const adjacent = circle1.position.x - circle2.position.x
          const rotation = Math.atan2(opposite, adjacent)

          const velocity2 = new Vector(
            90 * Math.cos(rotation + Math.PI) * power,
            90 * Math.sin(rotation + Math.PI) * power)
          circle2.velocity = circle2.velocity.addTo(velocity2)

          const velocity1 = new Vector(
            90 * Math.cos(rotation) * power,
            90 * Math.sin(rotation) * power)
          circle1.velocity = circle1.velocity.addTo(velocity1)
        }
      }
    }

    this.update(shapes, this.delta)
  }

  update(shapes, delta) {
    shapes.forEach(shape => {
      const circle = shape.mob

      const newPosition = circle.position.add(circle.velocity.multiply(delta))

      let collision = false
      if (newPosition.x - circle.radius <= 0) {
        circle.velocity.x = -circle.velocity.x
        circle.position.x = circle.radius
        collision = true
      } else if (newPosition.x + circle.radius >= this.screen.width ){
        circle.velocity.x = -circle.velocity.x
        circle.position.x = this.screen.width - circle.radius
        collision = true
      }

      if (newPosition.y - circle.radius <= 0) {
        circle.velocity.y = -circle.velocity.y
        circle.position.y = circle.radius
        collision = true
      } else if(newPosition.y + circle.radius >= this.screen.height){
        circle.velocity.y = -circle.velocity.y
        circle.position.y = this.screen.height - circle.radius
        collision = true
      }

      if (!collision) {
        circle.nextPosition = newPosition
      } else {
        circle.nextPosition = Vector.zero()
      }
    })
  }
}