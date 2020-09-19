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

document.querySelector("#switch").addEventListener("click", function () {
  isScene2 = !isScene2;
});

window.addEventListener("resize", function () {
  scene2.updateRatio();
  engine.resize();
});
engine.resize();
