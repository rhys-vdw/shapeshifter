import BABYLON, {
  Camera, Color3, Engine, FollowCamera, FreeCamera, Scene, Sprite, SpriteManager, TargetCamera, Vector3
} from 'babylonjs';
import * as mapBuilder from './map-builder';
import Player from './player';
import * as mapGenerator from './map-generator';
import { remove } from 'lodash';
import BulletFactory from './bullet-factory';

window.BABYLON = BABYLON;

function createScene(engine) {
  const scene = new Scene(engine);
  scene.clearColor = Color3.Green();
  return scene;
}

function createTileManager(scene) {
  return new SpriteManager(
    'tile manager',
    'images/tile.png',
    2000,
    16,
    scene
  );
}

function createPlayerManager(scene) {
  return new SpriteManager(
    'player manager',
    'images/man.png',
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

    //this.createTile({ x: 0, y: -5 });
    this.createTiles(mapGenerator.getSection(0, 100));

    const playerManager = createPlayerManager(this.scene);

    const bulletFactory = new BulletFactory(this);
    const player = new Player(new Sprite('Player', playerManager), bulletFactory);
    player.sprite.position.x = 10;
    player.sprite.width = 2;
    player.sprite.height = 2;
    this.entities = [player];
    this.player = player;
  }

  createTiles(tiles) {
    tiles.forEach(tile => this.createTile(tile.position));
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

  addEntity(entity) {
    this.entities.push(entity);
  }

  render({ time, deltaTime }) {

    const { player, camera, entities, tiles } = this;

    // Camera follow.
    camera.position.x = Math.max(
      camera.position.x,
      player.sprite.position.x
    );

    // First remove any destroyed entities.
    remove(entities, e => {
      if (e.shouldDestroy) {
        e.sprite.dispose();
        return true;
      }
      return false;
    });

    // Update all remaining entiteis.
    entities.forEach(e => e.update({ deltaTime, time }));

    // Check for collisions.
    for (const entity of entities) {
      for (const tile of tiles) {
        if (intersects(tile, entity.sprite)) {
          entity.onCollision(tile);
        }
      }
    }

    // Render scene.
    this.scene.render();
  }
}
