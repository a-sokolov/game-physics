export class Collider {
  constructor() {
    //
  }

  collidePlatformBottom(object, tileBottom) {
    /**
     * If the top of the object is above the bottom of the tile and on the previous
     * frame the top of the object was below the bottom of the tile, we have entered into
     * this tile. Pretty simple stuff.
     * */
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

  collide(value, object, tileX, tileY, size) {
    const { width, height } = size

    if (value === undefined) {
      debugger
    }

    /**
     * All 15 tile types can be described with only 4 collision methods. These
     * methods are mixed and matched for each unique tile.
     * */
    switch(value) {
      case 1:
        this.collidePlatformTop(object, tileY)
        break
      case 2:
        this.collidePlatformRight(object, tileX + width)
        break
      case 3:
        // If there's a collision, we don't need to check for anything else.
        if (this.collidePlatformTop(object, tileY)) return
        this.collidePlatformRight(object,tileX + width)
        break
      case 4: this.collidePlatformBottom(object, tileY + height)
        break
      case 5: 
        if (this.collidePlatformTop(object, tileY)) return
        this.collidePlatformBottom(object, tileY + height)
        break
      case 6:
        if (this.collidePlatformRight(object, tileX + width)) return
        this.collidePlatformBottom(object, tileY + height)
        break
      case 7:
        if (this.collidePlatformTop(object, tileY)) return
        if (this.collidePlatformBottom(object, tileY + height)) return
        this.collidePlatformRight(object, tileX + width)
        break
      case 8:
        this.collidePlatformLeft(object, tileX)
        break
      case 9:
        if (this.collidePlatformTop(object, tileY)) return
        this.collidePlatformLeft(object, tileX)
        break
      case 10:
        if (this.collidePlatformLeft(object, tileX)) return
        this.collidePlatformRight(object, tileX + width)
        break
      case 11:
        if (this.collidePlatformTop(object, tileY)) return
        if (this.collidePlatformLeft(object, tileX)) return
        this.collidePlatformRight(object, tileX + width)
        break
      case 12:
        if (this.collidePlatformBottom(object, tileY + height)) return
        this.collidePlatformLeft (object, tileX)
        break
      case 13:
        if (this.collidePlatformTop (object, tileY)) return
        if (this.collidePlatformBottom(object, tileY + height)) return
        this.collidePlatformLeft(object, tileX)
        break
      case 14:
        if (this.collidePlatformBottom(object, tileY + height)) return
        if (this.collidePlatformLeft (object, tileX)) return
        this.collidePlatformRight(object, tileX)
        break
      case 15:
        if (this.collidePlatformTop(object, tileY)) return
        if (this.collidePlatformBottom(object, tileY + height)) return
        if (this.collidePlatformLeft (object, tileX)) return
        this.collidePlatformRight(object, tileX + width)
        break
    }
  }
}