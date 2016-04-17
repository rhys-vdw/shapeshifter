import BABYLON, {
  Camera, Color3, Engine, FollowCamera, FreeCamera, Scene, Sprite, SpriteManager, TargetCamera, Vector3
} from 'babylonjs';
import * as mapBuilder from './map-builder';
import Player from './player';

window.BABYLON = BABYLON;

function createScene(engine) {
  const scene = new Scene(engine);
  scene.clearColor = Color3.Green();
  return scene;
}

function createTileManager(scene) {
  return new SpriteManager(
    'tile manager',
    '/images/tile.png',
    200,
    16,
    scene
  );
}

function createPlayerManager(scene) {
  return new SpriteManager(
    'player manager',
    '/images/man.png',
    1,
    32,
    scene
  );
}

function createCamera(scene, halfHeight) {
  const camera = new TargetCamera(
    'main camera', new Vector3(0,0,0), scene
  );
  camera.maxZ = 100;
  camera.mode = TargetCamera.ORTHOGRAPHIC_CAMERA;

  const aspectRatio = 640 / 480;
  const halfWidth = halfHeight * aspectRatio;
  camera.orthoTop    =  halfHeight - 0.5;
  camera.orthoBottom = -halfHeight - 0.5;
  camera.orthoRight  =  halfWidth - 0.5;
  camera.orthoLeft   = -halfWidth - 0.5;
  return camera;
}

function intersects(a, b) {
  return (
    (a.position.x + a.width / 2) > (b.position.x - b.width / 2) &&
    (a.position.x - a.width / 2) < (b.position.x + b.width / 2) &&
    (a.position.y + a.height / 2) > (b.position.y - b.height / 2) &&
    (a.position.y - a.height / 2) < (b.position.y + b.height / 2)
  );
}

export default class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scene = createScene(engine);
    this.tileManager = createTileManager(this.scene);
    this.camera = createCamera(this.scene, 10);
    this.tiles = [];

    this.createTile({ x: 0, y: -5 });
    this.target = { position: Vector3.Zero(), rotation: Vector3.Zero() };
    this.camera.target = this.target;

    const playerManager = createPlayerManager(this.scene);

    const player = new Player(new Sprite('Player', playerManager));
    player.width = 2;
    player.height = 2;
    this.entities = [player];
    this.player = player;
  }

  createTile(position) {
    const { tileManager } = this;
    const sprite = new Sprite(
      `Tile ${tileManager.sprites.length}`,
      tileManager
    );
    sprite.position.x = position.x;
    sprite.position.y = position.y;
    this.tiles.push(sprite);
  }

  render() {
    const { player } = this;
    const deltaTime = this.engine.getDeltaTime() / 1000;
    this.entities.forEach(e => e.update(deltaTime));

    for (const tile of this.tiles) {
      if (intersects(tile, player.sprite)) {
        player.collidedWith(tile);
      }
    }
    this.scene.render();
  }
}