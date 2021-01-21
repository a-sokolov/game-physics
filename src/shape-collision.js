import { Vector } from './vector'
import { Circle } from './circle'
import { circleAndScreenCollision, circlesCollision } from './utils'

export class ShapeCollision {
  constructor(screen) {
    this.screen = screen
  }

  collision(shapes) {
    shapes.forEach(shape => {
      const { mob } = shape
      if (mob instanceof Circle) {
        this.circleCollision(mob, shapes)
      }
    })
  }

  circleCollision(circle, shapes) {
    const { velocity } = circle
    const collision = circleAndScreenCollision(circle, this.screen)
    if (collision) {
      switch (collision.type) {
        case 'x':
          circle.setVelocityX(-velocity.x)
          break
        case 'y':
          circle.setVelocityY(-velocity.y)
          break
      }
    }

    this.calculatePositions(shapes)
    this.calculatePositions(shapes)
  }

  calculatePositions(shapes) {
    for (let i = 0; i < shapes.length - 1; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const circle1 = shapes[i].mob
        const circle2 = shapes[j].mob

        if (circlesCollision(circle1, circle2)) {
          // const v1 = circle1.position
          // const v2 = circle2.position
          //
          // const diff = Vector.substrVectors(v1, v2)
          // const penetrationDirection = Vector.normalize(diff)
          // const penetrationDeep = circle1.radius + circle2.radius - Vector.distance(v1, v2)
          //
          // const delta = penetrationDirection.multiple(penetrationDeep).multiple(0.5)
          // circle1.setPosition({ x: -delta.x, y: -delta.y })
          // circle2.setPosition(delta)
        }
      }
    }
  }
}