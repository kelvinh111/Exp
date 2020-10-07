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
window.isScene2 = true;

window.mb = null;
window.mb2 = null;

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
    rotateDuration: 1
  },
  dropConfig: {
    dropFirst: true,
    dropFirstDelay: 0,
    dropFirstDuration: 6.5,
    position: new BABYLON.Vector3(0, 0, 0),
    ringDelay: 9,
    bulbDuration: 5,
    bulbDelay: 0.065,
    color: htc("9cbfff"),
    colorDuration: 2.2,
    colorDelay: 1
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
    rotateDuration: 1
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 6, 0),
    ringDelay: 11.4,
    bulbDuration: 3.65,
    bulbDelay: 0.065,
    color: htc("9eaeff"),
    colorDuration: 2.2,
    colorDelay: 1.2
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
    rotateDuration: 1
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 11, 0),
    ringDelay: 13.87,
    bulbDuration: 3.55,
    bulbDelay: 0.1,
    color: htc("99bcff"),
    colorDuration: 2.2,
    colorDelay: 1.5
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
  num: 4000,
  angle: 137.5,
  gap: 2.5,
  matStep: 30,
  bulbSize: 0.2,
  height: 40,
  y: -20,
  delay: 7.6,
  bulbDelay: 0.15,
  bulbDuration: 1
};

window.bulbNumTotal =
  ring1Config.bulbNum + ring2Config.bulbNum + ring3Config.bulbNum;
// window.nbParticles = bulbNumTotal * 13;
window.nbParticles = bulbNumTotal * 7;
window.bulbCount = 0;
window.particleCount = 0;
