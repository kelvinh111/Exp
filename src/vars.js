/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global BABYLON */
import { stf, htc } from "./util.js";
console.log(kelvinUtil);
window.km = kelvinUtil.math;
window.canvas = document.getElementById("renderCanvas");
window.engine = new BABYLON.Engine(canvas, true);
window.fr = 10;

/*
0: intro
1: turning to circular
2: in circular animation
3: turning to wave
4: in wave animation
*/
window.story = 0;
window.scene = null;
window.camera = null;
window.scene2 = null;
window.camera2 = null;
window.renderTarget = null;
window.isScene2 = false;

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
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: true,
    dropFirstDelay: 500,
    dropFirstDuration: 6000,
    position: new BABYLON.Vector3(0, 0, 0),
    ringDelay: 6000,
    bulbDuration: 5000,
    bulbDelay: 65,
    color: htc("9cbfff"),
    colorDuration: 2200,
    colorDelay: 1000
  },
  circularConfig: {
    height: 4,
    speed: 0.01,
    offsetDelta: 9,
    rotateDelta: 6
  },
  waveConfig: {
    height: 0.7,
    speed: 0.01
  }
};

window.ring2Config = {
  bulbNum: 36,
  radius: 8,
  position: new BABYLON.Vector3(0, 40, 0),
  bulbConfig: {
    size: 0.1,
    coreSize: 1.2,
    lightSize: 1,
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 6, 0),
    ringDelay: 3400 + 5000,
    bulbDuration: 3650,
    bulbDelay: 45,
    color: htc("9eaeff"),
    colorDuration: 2200,
    colorDelay: 2000
  },
  circularConfig: {
    height: 5,
    speed: 0.015,
    offsetDelta: 0,
    rotateDelta: 8
  },
  waveConfig: {
    height: 1.25,
    speed: 0.015
  }
};

window.ring3Config = {
  bulbNum: 48,
  radius: 12,
  position: new BABYLON.Vector3(0, 40, 0),
  bulbConfig: {
    size: 0.1,
    coreSize: 1.2,
    lightSize: 1,
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 11, 0),
    ringDelay: 5150 + 5000,
    bulbDuration: 3550,
    bulbDelay: 125,
    color: htc("99bcff"),
    colorDuration: 2200,
    colorDelay: 2300
  },
  circularConfig: {
    height: 8.5,
    speed: 0.02,
    offsetDelta: 39,
    rotateDelta: 17
  },
  waveConfig: {
    height: 2.1,
    speed: 0.02
  }
};

window.spaceConfig = {
  num: 3000,
  angle: 137.5,
  gap: 2,
  matStep: 30,
  bulbSize: 0.2,
  height: 40,
  y: -15
};

window.bulbNumTotal =
  ring1Config.bulbNum + ring2Config.bulbNum + ring3Config.bulbNum;
window.nbParticles = bulbNumTotal * 13;
window.bulbCount = 0;
window.particleCount = 0;
