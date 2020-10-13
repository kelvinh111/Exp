/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

let scene1 = new Scene1();
let scene2 = new Scene2();

// FPS
let divFps = document.getElementById("fps");

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  scene1.render();
  if (isScene2) {
    scene2.render();
  }
});

if (isScene2) {
  camera.detachControl(canvas);
  camera2.attachControl(canvas, true);
} else {
  camera.attachControl(canvas, true);
  camera2.detachControl(canvas);
}

document.querySelector("#switch").addEventListener("click", function () {
  scene2.updateRatio();
  engine.resize();
  isScene2 = !isScene2;
  if (isScene2) {
    camera.detachControl(canvas);
    camera2.attachControl(canvas, true);
  } else {
    camera.attachControl(canvas, true);
    camera2.detachControl(canvas);
  }
});

document.querySelector("#bird").addEventListener("click", function () {
  if (story2 === 0) scene2.toBird();
});

document.querySelector("#screen").addEventListener("click", function () {
  if (story2 === 2) scene2.toScreen();
});

window.addEventListener("resize", function () {
  scene2.updateRatio();
  engine.resize();
});
scene2.updateRatio();
engine.resize();
