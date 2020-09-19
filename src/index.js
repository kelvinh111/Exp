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
});

window.addEventListener("resize", function () {
  engine.resize();
});
engine.resize();
