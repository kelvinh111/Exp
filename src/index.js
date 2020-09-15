/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./styles.scss";
import { stf, htc } from "./util.js";
import Ring from "./Ring";
import Bulb from "./Bulb";
import Stage from "./Stage";

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
// camera.maxZ = 100000;

// macbook
let macbookNodes = [];
function re(t) {
  if (t._children) {
    t._children.forEach((v) => {
      re(v);
    });
  } else {
    macbookNodes.push(t);
  }
}

BABYLON.SceneLoader.AppendAsync(
  "https://public.kelvinh.studio/cdn/3d/macbook/",
  "scene.gltf",
  scene
).then((s) => {
  s.rootNodes.forEach((v, k) => {
    if (v.id === "__root__") {
      v.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
      v.position.y = -50;
      re(v);
    }
  });

  initMirror();
});

var light = new BABYLON.HemisphericLight(
  "hemi",
  new BABYLON.Vector3(0, 10, -5),
  scene
);

let glow = new BABYLON.GlowLayer("glow", scene, {
  //mainTextureFixedSize: 512,
  blurKernelSize: 16
});

// Stage
new Stage(stageConfig);

// Rings
let ring1, ring2, ring3;
(() => {
  spsRing = new BABYLON.SolidParticleSystem("spsRing", scene, {
    enableMultiMaterial: true,
    updatable: true
  });
  // needa rotate bulb's core thus not billboard
  spsRing.billboard = false;
  spsRing.computeParticleRotation = true;
  spsRing.computeParticleColor = false;
  spsRing.computeParticleTexture = false;
  spsRing.computeParticleVertex = false;

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

  spsRing.addShape(circle, nbParticles);
  circle.dispose();
  let mesh = spsRing.buildMesh();

  spsRing.setMultiMaterial(mats);

  ring1 = new Ring(ring1Config);
  ring2 = new Ring(ring2Config);
  ring3 = new Ring(ring3Config);
  spsRing.computeSubMeshes();
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
})();

function initMirror() {
  var glass = BABYLON.MeshBuilder.CreateDisc(
    "cone",
    { radius: 150, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );

  glass.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
  glass.position.y = -50;

  //Ensure working with new values for glass by computing and obtaining its worldMatrix
  glass.computeWorldMatrix(true);
  var glass_worldMatrix = glass.getWorldMatrix();

  //Obtain normals for plane and assign one of them as the normal
  var glass_vertexData = glass.getVerticesData("normal");
  var glassNormal = new BABYLON.Vector3(
    glass_vertexData[0],
    glass_vertexData[1],
    glass_vertexData[2]
  );
  //Use worldMatrix to transform normal into its current value
  glassNormal = new BABYLON.Vector3.TransformNormal(
    glassNormal,
    glass_worldMatrix
  );

  //Create reflecting surface for mirror surface
  var reflector = new BABYLON.Plane.FromPositionAndNormal(
    glass.position,
    glassNormal.scale(-1)
  );

  //Create the mirror material
  var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
  //mirrorMaterial.specularColor = BABYLON.Color3.Yellow()
  mirrorMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture(
    "mirror",
    1024,
    scene,
    true
  );
  mirrorMaterial.reflectionTexture.mirrorPlane = reflector;
  mirrorMaterial.reflectionTexture.renderList = [spsRing.mesh].concat(
    macbookNodes
  );
  mirrorMaterial.reflectionTexture.level = 1;
  mirrorMaterial.reflectionTexture.adaptiveBlurKernel = 8;

  glass.material = mirrorMaterial;

  var cone = BABYLON.MeshBuilder.CreateCylinder(
    "cone",
    { diameterTop: 298, diameterBottom: 0, height: 100, tessellation: 128 },
    scene
  );
  cone.material = new BABYLON.StandardMaterial("cone", scene);
  //mirrorMaterial.specularColor = BABYLON.Color3.Yellow()
  cone.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  cone.position.y = -100.4;
}

scene.registerAfterRender(function () {
  ring1.update();
  ring2.update();
  ring3.update();
  spsRing.setParticles();
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

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
