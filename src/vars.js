/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global BABYLON */
import { stf, htc } from "./util.js";

window.ring1Config = {
  bulbNum: 16,
  radius: 40,
  position: new BABYLON.Vector3(0, 400, 0),
  bulbConfig: {
    size: 1,
    coreSize: 2,
    lightSize: 1.5,
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: true,
    dropFirstDelay: 500,
    dropFirstDuration: 4000,
    position: new BABYLON.Vector3(0, 0, 0),
    ringDelay: 1000 + 5000,
    bulbDuration: 5000,
    bulbDelay: 65,
    color: htc("f3fff1"),
    colorDuration: 2200,
    colorDelay: 1000
  },
  circularConfig: {
    height: 40,
    speed: 0.01,
    offsetDelta: 9,
    rotateDelta: 6
  },
  waveConfig: {
    height: 7,
    speed: 0.01
  }
};

window.ring2Config = {
  bulbNum: 36,
  radius: 80,
  position: new BABYLON.Vector3(0, 400, 0),
  bulbConfig: {
    size: 1,
    coreSize: 2,
    lightSize: 1.5,
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 60, 0),
    ringDelay: 3400 + 5000,
    bulbDuration: 3650,
    bulbDelay: 45,
    color: htc("d9fcff"),
    colorDuration: 2200,
    colorDelay: 2000
  },
  circularConfig: {
    height: 50,
    speed: 0.015,
    offsetDelta: 0,
    rotateDelta: 8
  },
  waveConfig: {
    height: 12.5,
    speed: 0.015
  }
};

window.ring3Config = {
  bulbNum: 48,
  radius: 120,
  position: new BABYLON.Vector3(0, 400, 0),
  bulbConfig: {
    size: 1,
    coreSize: 2,
    lightSize: 1.5,
    rotateDuration: 1000
  },
  dropConfig: {
    dropFirst: false,
    position: new BABYLON.Vector3(0, 110, 0),
    ringDelay: 5150 + 5000,
    bulbDuration: 3550,
    bulbDelay: 125,
    color: htc("dbe9ff"),
    colorDuration: 2200,
    colorDelay: 2300
  },
  circularConfig: {
    height: 85,
    speed: 0.02,
    offsetDelta: 39,
    rotateDelta: 17
  },
  waveConfig: {
    height: 21,
    speed: 0.02
  }
};

window.stageConfig = {
  num: 10000,
  angle: 137.5,
  gap: 25,
  matStep: 50,
  bulbSize: 2
};

window.bulbNumTotal =
  ring1Config.bulbNum + ring2Config.bulbNum + ring3Config.bulbNum;
window.nbParticles = bulbNumTotal * 7;
window.bulbCount = 0;
window.particleCount = 0;

/*
0: intro
1: turning to circular
2: in circular animation
3: turning to wave
4: in wave animation
*/
window.story = 0;

// multi materials - new material per bulb for changing color
window.mats = [];

window.spsRing = null;
window.scene = null;

window.km = kelvinUtil.math;
