import BABYLON, { Vector3, Sprite } from 'babylonjs';
import { lerpClamped, moveTowardClamped } from './math';

const PLAYER_SPEED = 10;
const JUMP_SPEED = 15;
const DECELERATION = 0.1;
const BULLET_SPEED = 40;
const FIRE_PERIOD = 0.1;
const GRAVITY = -50;

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

class Axis {
  constructor({ sensitivity = 1, gravity = 1, upKey, downKey }) {
    this.sensitivity = sensitivity;
    this.gravity = gravity;
    this.upKey = upKey;
    this.downKey = downKey;
    this.value = 0;
  }

  get() {
    return this.value;
  }

  reset() {
    this.value = 0;
  }

  update({ deltaTime }) {
    let target = 0;
    if (Input.isKeyDown(this.upKey)) {
      target += 1;
    }
    if (Input.isKeyDown(this.downKey)) {
      target -= 1;
    }

    this.value = moveTowardClamped(
      this.value,
      target,
      (target == 0 ?  this.gravity : this.sensitivity) * deltaTime
    );
  }
}

export default class Player {
  constructor(sprite, bulletFactory) {
    this.sprite = sprite;
    this.velocity = Vector3.Zero();
    this.isWalking = false;
    this.isFiring = false;
    this.lastFireTime = 0;
    this.bulletFactory = bulletFactory;
    this.aim = new Vector3(1, 0, 0);
    this.horizontalAxis = new Axis({
      upKey: Key.RIGHT,
      downKey: Key.LEFT,
      sensitivity: 6,
      gravity: 6
    });
    this.verticalAxis = new Axis({
      upKey: Key.UP,
      downKey: Key.DOWN,
      sensitivity: 9,
      gravity: 9
    });
  }

  update({ deltaTime, time }) {

    this.horizontalAxis.update({ deltaTime });
    this.verticalAxis.update({ deltaTime });

    this.velocity.x = PLAYER_SPEED * this.horizontalAxis.get();
    this.velocity.y += GRAVITY * deltaTime;

    // Update aim and walking.

    if (Input.isKeyDown(Key.RIGHT)) {
      this.isFacingRight = true;
    } else if (Input.isKeyDown(Key.LEFT)) {
      this.isFacingRight = false;
    }

    const horizontalAim = this.verticalAxis.get() === 0
      ? (this.isFacingRight ? 1 : -1) : this.horizontalAxis.get();

    this.aim.copyFromFloats(
      horizontalAim,
      this.verticalAxis.get(),
      0
    ).normalize();

    // Update jump.

    if (Input.isKeyDown(Key.JUMP)) {
      this.velocity.y = JUMP_SPEED;
    }

    // Update position.

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

    this.sprite.invertU = !this.isFacingRight;
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
