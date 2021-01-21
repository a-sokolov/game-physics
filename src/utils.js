export const circlesCollision = (circle1, circle2) => {
  const dx = circle1.position.x - circle2.position.x
  const dy = circle1.position.y - circle2.position.y
  const distance = Math.sqrt(dx ** 2 + dy ** 2)

  return distance < circle1.radius + circle2.radius;
}

export const circleAndScreenCollision = (circle, screen) => {
  const { position, radius } = circle
  const { width, height } = screen

  if (position.y + radius >= height || position.y - radius <= 0) {
    return { type: 'y' }
  }

  if (position.x + radius >= width || position.x - radius <= 0) {
    return { type: 'x' }
  }

  return null
}