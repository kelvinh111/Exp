/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./styles.scss";
import { stf, htc } from "./util.js";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";

stage1 = new Stage1();
stage2 = new Stage2();

// FPS
let divFps = document.getElementById("fps");

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  stage1.render();
  if (isStage2) {
    stage2.render();
  }
});

if (isStage2) {
  camera.detachControl(canvas);
  camera2.attachControl(canvas, true);
} else {
  camera.attachControl(canvas, true);
  camera2.detachControl(canvas);
}

document.querySelector("#switch").addEventListener("click", function () {
  stage2.updateRatio();
  engine.resize();
  isStage2 = !isStage2;
  if (isStage2) {
    camera.detachControl(canvas);
    camera2.attachControl(canvas, true);
  } else {
    camera.attachControl(canvas, true);
    camera2.detachControl(canvas);
  }
});

document.querySelector("#bird").addEventListener("click", function () {
  if (story2 === 0) stage2.bird.toBird();
});

document.querySelector("#screen").addEventListener("click", function () {
  if (story2 === 3) stage2.bird.toScreen();
});

window.addEventListener("resize", function () {
  stage2.bird.updateRatio();
  engine.resize();
});
stage2.bird.updateRatio();
engine.resize();
