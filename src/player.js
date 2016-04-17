import BABYLON, { Vector3, Sprite } from 'babylonjs';
import { lerpClamped } from './math';

const PLAYER_SPEED = 10;
const JUMP_SPEED = 15;
const DECELERATION = 0.1;
const FIRE_PERIOD = 0.1;

const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const RIGHT = 'ArrowRight';
const LEFT = 'ArrowLeft';
const JUMP = 'KeyX';
const SHOOT = 'KeyZ';

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

    Input.addListener(JUMP, () => this.jump());
  }

  update({ deltaTime, time }) {

    // Update shooting.

    console.log('shoot?', Input.isKeyDown(SHOOT));
    if (Input.isKeyDown(SHOOT) && this.lastFireTime + FIRE_PERIOD <= time) {
      this.bulletFactory.create(
        this.sprite.position,
        new Vector3(30, 0, 0)
      );
      this.lastFireTime = time;
    }

    // Update walking.

    if (Input.isKeyDown(RIGHT)) {
      this.acceleration.x = 5;
      this.isFacingRight = true;
    } else if (Input.isKeyDown(LEFT)) {
      this.acceleration.x = -5;
      this.isFacingRight = false;
    } else {
      this.acceleration.x = 0;
    }

    if (Input.isKeyDown(JUMP)) {
      this.velocity.y = JUMP_SPEED;
    }

    this.velocity.addInPlace(this.acceleration.scale(deltaTime * PLAYER_SPEED));
    this.sprite.position.addInPlace(this.velocity.scale(deltaTime));

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
