/* global kelvinUtil, BABYLON, Q, gb, util, km, Bulb */
import "./styles.scss";
import * as util from "./util.js";
//import { ring1Config, ring2Config, ring3Config } from "./configs.js";
import Ring from "./Ring";
import Bulb from "./Bulb";

let canvas = document.getElementById("renderCanvas");
let engine = new BABYLON.Engine(canvas, true);

scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0, 0, 0);

let camera = new BABYLON.ArcRotateCamera(
  "Camera",
  -Math.PI / 2,
  Math.PI / 2,
  800,
  new BABYLON.Vector3(0, 200, 0),
  scene
);
camera.attachControl(canvas, true);

let glow = new BABYLON.GlowLayer("glow", scene, {
  //mainTextureFixedSize: 512,
  blurKernelSize: 16
});

sps = new BABYLON.SolidParticleSystem("SPS", scene, {
  enableMultiMaterial: true,
  updatable: true
});
// needa rotate bulb's core thus not billboard
sps.billboard = false;
sps.computeParticleRotation = true;
sps.computeParticleColor = false;
sps.computeParticleTexture = false;
sps.computeParticleVertex = false;

let circle = BABYLON.MeshBuilder.CreateSphere(
  "sphere",
  {
    segments: 3,
    diameter: 1
  },
  scene
);

for (let i = 0; i < bulbNumTotal; i++) {
  let mat = new BABYLON.StandardMaterial("mat" + i, scene);
  mat.disableLighting = true;
  mat.backFaceCulling = false;
  mat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  window.mats.push(mat);
}

sps.addShape(circle, nbParticles);
circle.dispose();
let mesh = sps.buildMesh();

sps.setMultiMaterial(mats);

let ring1 = new Ring(ring1Config);
let ring2 = new Ring(ring2Config);
let ring3 = new Ring(ring3Config);
sps.computeSubMeshes();
console.log("bulbCount:", bulbCount, "particleCount:", particleCount);

Q.all([
  ring1.aniDrop(),
  ring1.aniOn(),
  ring2.aniDrop(),
  ring2.aniOn(),
  ring3.aniDrop(),
  ring3.aniOn()
])
  .delay(2000)
  .then(() => {
    story = 2;
  });

// FPS
let divFps = document.getElementById("fps");

// Inspector
let showingInspecter = false;
document.querySelector("#inspector").addEventListener("click", function () {
  showingInspecter = !showingInspecter;
  if (showingInspecter) {
    scene.debugLayer.show();
  } else {
    scene.debugLayer.hide();
  }
});

document.querySelector("#circular").addEventListener("click", function () {
  if (story === 0 || story === 1 || story === 2 || story === 3) return false;
  story = 1;
  Q.all([ring1.toCircular(), ring2.toCircular(), ring3.toCircular()]).then(
    () => {
      story = 2;
    }
  );
});

document.querySelector("#wave").addEventListener("click", function () {
  if (story === 0 || story === 1 || story === 3 || story === 4) return false;
  story = 3;
  Q.all([ring1.toWave(), ring2.toWave(), ring3.toWave()]).then(() => {
    story = 4;
  });
});

scene.registerAfterRender(function () {
  ring1.update();
  ring2.update();
  ring3.update();
  sps.setParticles();
});

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
