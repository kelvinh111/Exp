/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import onChange from "on-change";
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

let s1 = new Scene1();
let s2 = new Scene2();

function sceneChange() {
  if (g.scene === 1) {
    camera2.detachControl(canvas);
    if (g.story === 2 || g.story === 4) {
      camera.attachControl(canvas, true);
    }
  } else if (g.scene === 2) {
    // camera.detachControl(canvas);
    camera2.attachControl(canvas, true);

    if (g.story2 === 3) {
      camera2.attachControl(canvas, true);
    }
  }
}

/*
story
0: intro
1: turning to circular
2: in circular animation
3: turning to wave
4: in wave animation

story2
0: in screen ready
1: turning to bird
2: bird flapping animation
3: bird fly animation
4: turning to back to screen
*/
window.g = onChange(
  {
    scene: 2,
    story: 0,
    story2: 0
  },
  (path, value, previousValue, name) => {
    console.log(path, value, g);
    sceneChange();
  }
);
sceneChange();

// FPS
let divFps = document.getElementById("fps");

engine.runRenderLoop(function () {
  divFps.innerHTML = engine.getFps().toFixed() + " FPS";
  s1.render();
  if (g.scene === 2) {
    s2.render();
  }
});

document.querySelector("#switch").addEventListener("click", function () {
  bird.updateRatio();
  engine.resize();

  g.scene === 1 ? (g.scene = 2) : (g.scene = 1);
});

document.querySelector("#bird").addEventListener("click", function () {
  if (g.scene === 2 && g.story2 === 0) bird.toBird();
});

document.querySelector("#screen").addEventListener("click", function () {
  if (g.scene === 2 && g.story2 === 3) bird.toScreen();
});

window.addEventListener("resize", function () {
  bird.updateRatio();
  engine.resize();
});
bird.updateRatio();
engine.resize();
