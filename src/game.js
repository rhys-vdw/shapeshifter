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

window.addEventListener('blur', () => {
  // TODO
});

window.addEventListener('focus', () => {
  // TODO
});


function loop() {
  manager.render();
}

engine.resize();
engine.runRenderLoop(loop);
