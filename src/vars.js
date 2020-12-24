import { stf, htc } from "./util.js";

window.debug = false;
window.km = kelvinUtil.math;
window.canvas = document.getElementById("renderCanvas");
window.engine = new BABYLON.Engine(canvas, true);
window.fr = 10;
window.ee = new EventEmitter();
window.hasGyro = false;

// cache DOM
window.$s1 = document.querySelector("#s1");
window.$s2 = document.querySelector("#s2");
window.$cur = document.querySelector("#cursor");
window.$curRing = document.querySelector("#cursor-ring");
window.$curDot = document.querySelector("#cursor-dotted");
window.$name = document.querySelector("#name span");
window.$title = document.querySelector("#title");

window.s1 = null;
window.scene1 = null;
window.camera = null;

window.s2 = null;
window.scene2 = null;
window.camera2 = null;

window.scenesAniDone = false;

window.renderTarget = null;
window.mb = null;
window.ori = "crumbled";
window.paperInstance = null; // class instance
window.paperGltf = null;
window.paperMesh = null;
window.flowerGltf = null;
window.flower = null;
window.trashGltf = null;
window.trash = null;

window.s2light = null;

window.s1gl = null; // scene1 glow layer
window.spsRing = null;
window.ringsMats = [];
window.ring1Config = {
  bulbNum: 16,
  radius: 4,
  position: new BABYLON.Vector3(0, 40, 0),
  bulbConfig: {
    size: 0.1,
    coreSize: 1.2,
    lightSize: 1,
    rotateDuration: 1,
  },
  dropConfig: {
    dropFirst: true,
    dropFirstDelay: 0,
    dropFirstDuration: 6.5,
    position: new BABYLON.Vector3(0, 0, 0),
    ringDelay: 9,
    bulbDuration: 5,
    bulbDelay: 0.065,
    color: htc("85a6ff"),
    colorDuration: 2.2,
    colorDelay: 1,
  },
  circularConfig: {
    height: 4,
    speed: 0.01,
    offsetDelta: 9,
    rotateDelta: 6,
  },
  waveConfig: {
    height: 0.7,
    speed: 0.01,
  },
};

window.ring2Config = {
  bulbNum: 36,
  radius: 8,
  position: new BABYLON.Vector3(0, 40, 0),
  bulbConfig: {
    size: 0.1,
    coreSize: 1.2,
    lightSize: 1,
    rotateDuration: 1,
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 5.6, 0),
    ringDelay: 11.4,
    bulbDuration: 3.65,
    bulbDelay: 0.065,
    color: htc("8997ff"),
    colorDuration: 2.2,
    colorDelay: 1.2,
  },
  circularConfig: {
    height: 5,
    speed: 0.015,
    offsetDelta: 0,
    rotateDelta: 8,
  },
  waveConfig: {
    height: 1.25,
    speed: 0.015,
  },
};

window.ring3Config = {
  bulbNum: 48,
  radius: 12,
  position: new BABYLON.Vector3(0, 40, 0),
  bulbConfig: {
    size: 0.1,
    coreSize: 1.2,
    lightSize: 1,
    rotateDuration: 1,
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 11, 0),
    ringDelay: 13.87,
    bulbDuration: 3.55,
    bulbDelay: 0.1,
    color: htc("918dff"),
    colorDuration: 2.2,
    colorDelay: 1.5,
  },
  circularConfig: {
    height: 8.5,
    speed: 0.02,
    offsetDelta: 39,
    rotateDelta: 17,
  },
  waveConfig: {
    height: 2.1,
    speed: 0.02,
  },
};

window.spaceConfig = {
  num: 5000,
  angle: 137.5,
  gap: 5,
  matStep: 20,
  bulbSize: 0.2,
  height: 50,
  y: -20,
  delay: 7.6,
  bulbDelay: 0.15,
  bulbDuration: 1,
};

window.bulbNumTotal =
  ring1Config.bulbNum + ring2Config.bulbNum + ring3Config.bulbNum;
window.nbParticles = bulbNumTotal * 7;
window.bulbCount = 0;
window.particleCount = 0;

window.paperConfig = {
  cam: {
    alpha: -Math.PI / 2,
    beta: 0,
    radius: 7,
    target: new BABYLON.Vector3(0, 0, 0),
  },
  aniStart: {
    scaling: 0.4,
    scalingDur: 1,
  },
  aniEnd: {},
};
