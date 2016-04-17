import { Sprite, SpriteManager } from 'babylonjs';

let nextId = 0;

class Bullet {
  constructor(sprite, velocity) {
    this.id = nextId++;
    this.sprite = sprite;
    this.velocity = velocity;
  }

  update({ deltaTime, time }) {
    const step = this.velocity.scale(deltaTime);
    this.sprite.position.addInPlace(step);
  }

  onCollision(other) {
    this.destroy();
  }

  destroy() {
    this.shouldDestroy = true;
  }
}

export default class BulletFactory {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.spriteManager = new SpriteManager(
      'Bullet sprite manager',
      'images/bullet.png',
      100,
      8,
      sceneManager.scene
    );
  }

  create(position, velocity) {
    const sprite = new Sprite('Bullet', this.spriteManager);
    sprite.position.copyFrom(position);
    const bullet = new Bullet(sprite, velocity);
    this.sceneManager.addEntity(bullet);
    return bullet;
  }
}
