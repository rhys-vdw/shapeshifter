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
    //console.log('collided with!', tile);
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
