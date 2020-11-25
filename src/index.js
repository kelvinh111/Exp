import onChange from "on-change";
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

let totalCount = 0;
let finishCount = 0;

ee.addListener("asset-start", (args) => {
  // console.log(args);
  totalCount += args.totalCount;
  // console.log("totalCount", totalCount);
});

ee.addListener("asset-progress", (args) => {
  finishCount++;
  // console.log("progress", args, finishCount);
  console.log("progress", ((finishCount / totalCount) * 100).toFixed(2) + "%");
});

ee.addListener("asset-finish", (args) => {
  // console.log("finish", args, finishCount, totalCount);
  console.log("loading finished");
  if (finishCount === totalCount) {
    s1.init();
    s2.init();
    engine.runRenderLoop(function () {
      divFps.innerHTML = engine.getFps().toFixed() + " FPS";
      s1.render();
      if (g.scene === 2) {
        s2.render();
      }
    });
    paperInstance.updateRatio();
    engine.resize();
    sceneChange();
  }
});

let s1 = new Scene1();
let s2 = new Scene2();

function sceneChange(path, value, previousValue) {
  console.log(path, value, previousValue)
  if (g.scene === 1) {
    camera2.detachControl(canvas);
    s1.fromScene2();
    if (g.story === 2 || g.story === 4) {
      camera.attachControl(canvas, true);
    }
  } else if (g.scene === 2) {
    camera.detachControl(canvas);
    camera2.attachControl(canvas, true);
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
1: paper animation
2: paper animation done
3: turning back to scene1
*/
window.g = onChange(
  {
    scene: 1,
    story: 0,
    story2: 0,
  },
  (path, value, previousValue, name) => {
    // console.log(path, value, previousValue);
    sceneChange(path, value, previousValue);
  }
);

// FPS
let divFps = document.getElementById("fps");


let showingInspecter = false;
document.querySelector("#inspector").addEventListener("click", () => {
  showingInspecter = !showingInspecter;
  console.log(g.scene)
  if (showingInspecter) {
    if (g.scene === 1) scene.debugLayer.show();
    else if (g.scene ===2) scene2.debugLayer.show();
  } else {
    if (g.scene === 1) scene.debugLayer.hide();
    else if (g.scene ===2) scene2.debugLayer.hide();
  }
});

document.querySelector("#switch").addEventListener("click", function () {
  paperInstance.updateRatio();
  engine.resize();

  g.scene === 1 ? (g.scene = 2) : (g.scene = 1);
});

document.querySelector("#paper").addEventListener("click", function () {
  if (g.scene === 2 && g.story2 === 0) s2.animate();
});

document.querySelector("#screen").addEventListener("click", function () {
  if (g.scene === 2 && g.story2 === 2) paperInstance.toScreen();
});

window.addEventListener("resize", function () {
  paperInstance.updateRatio();
  engine.resize();
});
