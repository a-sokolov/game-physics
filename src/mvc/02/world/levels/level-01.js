import { Level } from '../objects/level'
import { StaticMapAnimation } from "../../graphic/static-map-animation"

export const COIN_TILES = {
  name: 'coin-tiles',
  width: 512,
  height: 256,
  spriteWidth: 128,
  spriteHeight: 128
}

export class Level01 extends Level {
  constructor() {
    const sharedMap = {
      rows: 10,
      columns: 32,
      size: 64,
      map: [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 2, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }

    const coinsStaticAnimation = new StaticMapAnimation(
      { ...sharedMap, tileIndex:2 },
      COIN_TILES,
      [1, 2, 3, 4, 5, 6, 7, 8],
      2)

    const tileMap = {
      ...sharedMap,
      imageName: 'brick',
      tileIndex: 1
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
    const collisionMap =
       [0, 0, 0 , 15, 15, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 15, 15, 15, 15, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 0 , 0 , 0 , 15, 15, 15, 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 15, 15, 15, 0 , 0 , 0 , 15, 15, 15, 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 15, 15, 15, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    super(tileMap, collisionMap)

    this.addStaticAnimation(coinsStaticAnimation)
  }
}