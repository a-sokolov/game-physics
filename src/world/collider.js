export const CollisionType = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right'
}

/**
 * Здесь происходит вся магия вычисления коллизий в зависимости на какой тип ячейки врезался игрок.
 * Внимание! Сейчас необходимо, чтобы размеры игрока соотв. одному спрайту карты.
 * */
export class Collider {
  constructor() {
    //
  }

  /**
   * If the top of the object is above the bottom of the tile and on the previous
   * frame the top of the object was below the bottom of the tile, we have entered into
   * this tile. Pretty simple stuff.
   * */
  collidePlatformBottom(object, tileBottom) {
    if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
      object.setTop(tileBottom)  // Move the top of the object to the bottom of the tile.
      object.velocityY = 0       // Stop moving in that direction.
      return true                // Return true because there was a collision.
    }

    return false
  }

  collidePlatformLeft(object, tileLeft) {
    if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
      object.setRight(tileLeft - 0.01) // -0.01 is to fix a small problem with rounding
      object.velocityX = 0
      return true
    }
    
    return false
  }

  collidePlatformRight(object, tileRight) {
    if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
      object.setLeft(tileRight)
      object.velocityX = 0
      return true
    }
    
    return false
  }

  collidePlatformTop(object, tileTop) {
    if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
      object.setBottom(tileTop - 0.01)
      object.velocityY = 0
      object.jumping = false
      return true
    }
    
    return false
  }

  /**
   * Конвертация кода коллизий в 2 формат с лидирующими нулями.
   * На выходе всегда должно быть 4 символа.
   * */
  dec2Bin(dec) {
    const bin = (dec >>> 0).toString(2)
    return `${'0'.repeat(4 - bin.length)}${bin}`
  }

  /**
   * 0 0 0 0 = l b r t
   *
   * 0000 00 - no walls
   * 0001 01 - top wall
   * 0010 02 - right wall
   * 0011 03 - right-top wall
   * 0100 04 - bottom wall
   * 0101 05 - bottom-top wall
   * 0110 06 - bottom-right wall
   * 0111 07 - bottom-right-top wall
   * 1000 08 - left wall
   * 1001 09 - left-top wall
   * 1010 10 - left-right wall
   * 1011 11 - left-right-top wall
   * 1100 12 - left-bottom wall
   * 1101 13 - left-bottom-top wall
   * 1110 14 - left-bottom-right wall
   * 1111 15 - all walls
   *
   * @param value код коллизии (см. описание выше)
   * @param index номер ячейки в сетке уровня
   * @param object игрок
   * @param tileX x координата ячейки
   * @param tileY y координата ячвейки
   * @param size размер спрайта
   * */
  collide(value, index, object, tileX, tileY, size) {
    const { width, height } = size

    const bin = this.dec2Bin(value)
    if ((bin & '0001') !== 0) {
      // top
      if (this.collidePlatformTop(object, tileY)) return CollisionType.top
    }
    if ((bin & '0010') !== 0) {
      // right
      if (this.collidePlatformRight(object, tileX + width)) return CollisionType.right
    }
    if ((bin & '0100') !== 0) {
      // bottom
      if (this.collidePlatformBottom(object, tileY + height)) return CollisionType.bottom
    }
    if ((bin & '1000') !== 0) {
      // left
      if (this.collidePlatformLeft(object, tileX)) return CollisionType.left
    }

    return null
  }
}