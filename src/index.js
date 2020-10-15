/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

let s1 = new Scene1();
let s2 = new Scene2();

// FPS
let divFps = document.getElementById("fps");

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  s1.render();
  if (isScene2) {
    s2.render();
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
  s2.bird.updateRatio();
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
  if (story2 === 0) bird.toBird();
});

document.querySelector("#screen").addEventListener("click", function () {
  if (story2 === 3) bird.toScreen();
});

window.addEventListener("resize", function () {
  bird.updateRatio();
  engine.resize();
});
bird.updateRatio();
engine.resize();
