import BABYLON, { Camera,FreeCamera, SpriteManager, Sprite, Vector3, TargetCamera, Color3, Engine, Scene } from 'babylonjs';

function createScene(engine) {
  const scene = new Scene(engine);
  scene.clearColor = Color3.Green();
  return scene;
}

function createEngine(canvas) {
  return new Engine(canvas, false, { generateMipMaps: false });
}

function createFreeCamera(canvas, scene) {
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 5, -100),
    scene
  );
  camera.attachControl(canvas);
  return camera;
}

function createCamera(canvas, scene, halfHeight) {
  const camera = new Camera(
    'main camera', new Vector3(0, 0, -10), scene
  );
  camera.maxZ = 100;
  camera.mode = TargetCamera.ORTHOGRAPHIC_CAMERA;

  const aspectRatio = 640 / 480;
  const halfWidth = halfHeight * aspectRatio;
  camera.orthoTop = halfHeight;
  camera.orthoBottom = -halfHeight;
  camera.orthoRight = halfWidth;
  camera.orthoLeft = -halfWidth;
  camera.attachControl(canvas);
  return camera;
}

function createArcCamera(canvas, scene) {
  const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      1,
      0.8,
      8,
      new BABYLON.Vector3(0, 0, 0),
      scene
  );
  camera.attachControl(canvas, true);
  return camera;
}


const canvas = document.getElementById('renderCanvas');
const engine = createEngine(canvas);
const scene = createScene(engine);
//const camera = createFreeCamera(canvas, scene);
const camera = createCamera(canvas, scene, 10);
const light = new BABYLON.PointLight("Point", new Vector3(5, 10, 5), scene);

const tileManager = new SpriteManager(
  'tile manager',
  '/images/tile.png',
  200,
  16,
  scene
);

function createTile(position) {
  const sprite = new Sprite(
    `Tile ${tileManager.sprites.length}`,
    tileManager
  );
  sprite.position.x = position.x;
  sprite.position.y = position.y;
  return sprite;
}

for (let i = 0; i < 10; i ++) {
  createTile(new Vector3(i, 0, 0));
}

console.log('manager', tileManager);
const tile = createTile(new Vector3(0, 1, -1));
console.log('tile', tile);
//camera.setTarget(tile.position);
//camera.lockedTarget = tile;
console.log('camera', camera);


window.addEventListener('resize', () => {
  engine.resize();
  scene.render();
});

window.addEventListener('blur', () => {
  // TODO
});

window.addEventListener('focus', () => {
  // TODO
});


function loop() {
  scene.render();
}

engine.resize();
engine.runRenderLoop(loop);
