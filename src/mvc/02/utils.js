export const getTileMapPoints = (tileMap, callback) => {
  const { imageName, tileIndex, size, columns, map } = tileMap

  for (let index = map.length - 1; index > -1; -- index) {
    if (map[index] === tileIndex) {
      const destinationX = (index % columns) * size
      const destinationY = Math.floor(index / columns) * size

      callback({
        name: imageName,
        x: destinationX,
        y: destinationY,
        width: size,
        height: size
      })
    }
  }
}