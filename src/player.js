import BABYLON, { Vector3, Sprite } from 'babylonjs';

const PLAYER_SPEED = 10;

export default class Player {
  constructor(sprite) {
    this.sprite = sprite;
    this.velocity = Vector3.Zero();
    this.acceleration = new Vector3(0, -0.5, 0);
    this.registerKeybindings();
    this.isWalking = false;
  }

  update(deltaTime) {
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

    this.sprite.invertU = this.velocity.x < 0;
  }

  collidedWith(tile) {
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

  walkLeft() {
    this.acceleration.x = -5;
  }

  walkRight() {
    this.acceleration.x = 5;
  }

  stopWalking() {
    this.acceleration.x = 0;
  }

  registerKeybindings() {
    window.addEventListener('keydown', event => {
      switch (event.code) {
        case 'ArrowRight': this.walkRight(); return;
        case 'ArrowLeft': this.walkLeft(); return;
      }
    });

    window.addEventListener('keyup', event => {
      switch (event.code) {
        case 'ArrowRight': this.stopWalking(); return;
        case 'ArrowLeft': this.stopWalking(); return;
      }
    });
  }
}
