import BABYLON, { Vector3, Sprite } from 'babylonjs';
import { lerpClamped } from './math';

const PLAYER_SPEED = 10;
const JUMP_SPEED = 15;
const DECELERATION = 0.1;
const BULLET_SPEED = 40;
const FIRE_PERIOD = 0.1;

const Key = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  JUMP: 'KeyX',
  SHOOT: 'KeyZ',
}

const Direction = {
  UP: new Vector3(0, 1, 0),
  UP_RIGHT: new Vector3(1, 1, 0).normalize(),
  RIGHT: new Vector3(1, 0, 0),
  DOWN_RIGHT: new Vector3(1, -1, 0).normalize(),
  DOWN: new Vector3(0, -1, 0),
  DOWN_LEFT: new Vector3(-1, -1, 0).normalize(),
  LEFT: new Vector3(-1, 0, 0),
  UP_LEFT: new Vector3(-1, 1, 0).normalize(),
}

/*
const Direction = {
  UP: 'UP',
  UP_RIGHT: 'UP_RIGHT',
  RIGHT: 'RIGHT',
  DOWN_RIGHT: 'DOWN_RIGHT',
  DOWN: 'DOWN',
  DOWN_LEFT: 'DOWN_LEFT',
  LEFT: 'LEFT',
  UP_LEFT: 'UP_LEFT',
}
*/

const State = {
  STANDING: 'STANDING',
  WALKING: 'WALKING',
  JUMPING: 'JUMPING',
}

import Input from './input';

export default class Player {
  constructor(sprite, bulletFactory) {
    this.sprite = sprite;
    this.velocity = Vector3.Zero();
    this.acceleration = new Vector3(0, -3, 0);
    this.isWalking = false;
    this.isFiring = false;
    this.lastFireTime = 0;
    this.bulletFactory = bulletFactory;
    this.aim = new Vector3(1, 0, 0);
  }

  update({ deltaTime, time }) {

    // Update aim and walking.

    if (Input.isKeyDown(Key.RIGHT)) {
      this.acceleration.x = 5;
      this.isFacingRight = true;
      if (Input.isKeyDown(Key.UP)) {
        this.aim = Direction.UP_RIGHT;
      } else if (Input.isKeyDown(Key.DOWN)) {
        this.aim = Direction.DOWN_RIGHT;
      } else {
        this.aim = Direction.RIGHT;
      }
    } else if (Input.isKeyDown(Key.LEFT)) {
      this.acceleration.x = -5;
      this.isFacingRight = false;
      if (Input.isKeyDown(Key.UP)) {
        this.aim = Direction.UP_LEFT;
      } else if (Input.isKeyDown(Key.DOWN)) {
        this.aim = Direction.DOWN_LEFT;
      } else {
        this.aim = Direction.LEFT;
      }
    } else {
      this.acceleration.x = 0;

      if (Input.isKeyDown(Key.UP)) {
        this.aim = Direction.UP;
      } else if (Input.isKeyDown(Key.DOWN)) {
        this.aim = this.isFacingRight
          ? Direction.DOWN_RIGHT : Direction.DOWN_LEFT;
      } else {
        this.aim = this.isFacingRight
          ? Direction.RIGHT : Direction.LEFT;
      }
    }

    // Update jump.

    if (Input.isKeyDown(Key.JUMP)) {
      this.velocity.y = JUMP_SPEED;
    }

    // Update position.

    this.velocity.addInPlace(this.acceleration.scale(deltaTime * PLAYER_SPEED));
    this.sprite.position.addInPlace(this.velocity.scale(deltaTime));

    // Update shooting.

    if (Input.isKeyDown(Key.SHOOT) && this.lastFireTime + FIRE_PERIOD <= time) {
      this.bulletFactory.create(
        this.sprite.position,
        this.aim.scale(BULLET_SPEED)
      );
      this.lastFireTime = time;
    }


    if (Math.abs(this.velocity.x) < 0.1) {
      if (this.isWalking) {
        this.sprite.stopAnimation();
        this.sprite.cellIndex = 0;
        this.isWalking = false;
      }
    } else {
      if (!this.isWalking) {
        this.sprite.playAnimation(0, 2, true, 100);
        this.isWalking = true;
      }
    }

    if (Math.abs(this.acceleration.x) < 0.1) {
      this.velocity.x = lerpClamped(this.velocity.x, 0, DECELERATION);
    }

    this.sprite.invertU = this.velocity.x < 0;
  }

  onCollision(tile) {
    const halfTileWidth = tile.width / 2;
    const halfTileHeight = tile.height / 2;
    const halfPlayerWidth = this.sprite.width / 2;
    const halfPlayerHeight = this.sprite.height / 2;

    const halfWidths = halfTileWidth + halfPlayerWidth;
    const halfHeights = halfTileHeight + halfPlayerHeight;

    const offset = this.sprite.position.subtract(tile.position);
    const overlapX = Math.abs(offset.x) - halfWidths;
    const overlapY = Math.abs(offset.y) - halfHeights;

    if (overlapY >= overlapX) {
      if (offset.y < 0) {
        this.sprite.position.y += overlapY;
      } else {
        this.sprite.position.y -= overlapY;
      }
      this.velocity.y = 0;
    } else {
      if (offset.x < 0) {
        this.sprite.position.x += overlapX;
      } else {
        this.sprite.position.x -= overlapX;
      }
      this.velocity.x = 0;
    }
  }
}
