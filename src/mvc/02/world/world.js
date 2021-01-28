import { Player } from './player'
import { PlayerAnimation } from './player-animation'
import { Collider } from './collider'
import {Rect} from "../base/rect";

export const PLAYER_TILES = {
  name: 'rick-tiles',
  width: 512,
  height: 660,
  spriteWidth: 128,
  spriteHeight: 165
}

export class World {
  constructor(friction = 0.9, gravity = 3) {
    this.backgroundColor = 'orange'
    this.width = 1024
    this.height = 640

    this.friction = friction
    this.gravity = gravity

    this.player = new Player({
      x: 10,
      y: 500,
      width: 60, // PLAYER_TILES.spriteWidth / 2,
      height: 60, // PLAYER_TILES.spriteHeight / 2,
      jumpPower: 50,
      speed: 1.5,
      collisionOffsets: {
        bottom: {
          start: 20,
          end: 40
        }
      }
    })
    this.playerAnimation = new PlayerAnimation(PLAYER_TILES, 150)
    this.playerAnimation.watch(this.player)

    this.tileMap = {
      imageName: 'brick',
      rows: 10,
      columns: 16,
      size: 64,
      map: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    /**
     * These collision values correspond to collision functions in the Collider class.
     * 0 is nothing. everything else is run through a switch statement and routed to the
     * appropriate collision functions. These particular values aren't arbitrary. Their binary
     * representation can be used to describe which sides of the tile have boundaries.
     * 0000 = 0  tile 0:    0    tile 1:   1     tile 2:    0    tile 15:    1
     * 0001 = 1           0   0          0   0            0   1            1   1
     * 0010 = 2             0              0                0                1
     * 1111 = 15        No walls     Wall on top      Wall on Right      four walls
     * This binary representation can be used to describe which sides of a tile are boundaries.
     * Each bit represents a side: 0 0 0 0 = l b r t (left bottom right top). Keep in mind
     * that this is just one way to look at it. You could assign your collision values
     * any way you want. This is just the way I chose to keep track of which values represent
     * which tiles. I haven't tested this representation approach with more advanced shapes. */

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
     * */
    this.collisionMap =
      [0, 0, 0, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 15, 15, 15, 0, 0, 0, 15, 15, 15, 0, 0,
       0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    this.collisionRects = []
    this.collider = new Collider()
  }

  collideObject(object) {
    if (object.getLeft() < 0) {
      object.setLeft(0)
      object.velocityX = 0
    } else if (object.getRight() > this.width) {
      object.setRight(this.width)
      object.velocityX = 0
    }

    if (object.getTop() < 0) {
      object.setTop(0)
      object.velocityY = 0
    } else if (object.getBottom() > this.height) {
      object.setBottom(this.height)
      object.velocityY = 0
      object.jumping = false
    }

    if (object.oldY < object.y) {
      // prevent jump if we are falling
      object.jumping = true
    }

    const { size, columns } = this.tileMap
    let bottom, left, right, top, value

    this.collisionRects = []

    top = Math.floor(object.getTop() / size)
    left = Math.floor(object.getLeft() / size)
    value = this.collisionMap[top * columns + left]
    this.collider.collide(value, object, left * size, top * size, size)

    this.collisionRects.push(new Rect(left * size, top * size, size, size))

    top = Math.floor(object.getTop() / size)
    right = Math.floor(object.getRight() / size)
    value = this.collisionMap[top * columns + right]
    this.collider.collide(value, object, right * size, top * size, size)

    this.collisionRects.push(new Rect(right * size, top * size, size, size))

    bottom = Math.floor(object.getBottom() / size)
    left = Math.floor(object.getLeft() / size)
    value = this.collisionMap[bottom * columns + left]
    this.collider.collide(value, object, left * size, bottom * size, size)

    this.collisionRects.push(new Rect(left * size, bottom * size, size, size))

    bottom = Math.floor(object.getBottom() / size)
    right = Math.floor(object.getRight() / size)
    value = this.collisionMap[bottom * columns + right]
    this.collider.collide(value, object, right * size, bottom * size, size)

    this.collisionRects.push(new Rect(right * size, bottom * size, size, size))
  }

  update(time) {
    this.player.velocityY += this.gravity
    this.player.update()
    this.playerAnimation.update(time)

    this.player.velocityX *= this.friction
    this.player.velocityY *= this.friction

    this.collideObject(this.player)
  }
}