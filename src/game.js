import BABYLON, { Camera,FreeCamera, SpriteManager, Sprite, Vector3, TargetCamera, Color3, Engine, Scene } from 'babylonjs';
import SceneManager from './scene-manager';

function createEngine(canvas) {
  return new Engine(canvas, false, { generateMipMaps: false });
}

const canvas = document.getElementById('renderCanvas');
const engine = createEngine(canvas);

const manager = new SceneManager(engine);

window.addEventListener('resize', () => {
  // TODO
});

let time = 0;
function loop() {
  const deltaTime = engine.getDeltaTime() / 1000;
  time += deltaTime;
  manager.render({ deltaTime, time });
}

window.addEventListener('blur', () => {
  engine.stopRenderLoop(loop);
});

window.addEventListener('focus', () => {
  engine.runRenderLoop(loop);
});


engine.resize();
engine.runRenderLoop(loop);
