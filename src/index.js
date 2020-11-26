import onChange from "on-change";
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

// loading screen
// of preloading all assets
let totalCount = 0;
let finishCount = 0;

ee.addListener("asset-start", (args) => {
  totalCount += args.totalCount;
});

ee.addListener("asset-progress", (args) => {
  finishCount++;
  console.log("progress", ((finishCount / totalCount) * 100).toFixed(2) + "%");
});

ee.addListener("asset-finish", (args) => {
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
  }
});

// Scenes management
let s1 = new Scene1();
let s2 = new Scene2();

/*
story
0: intro
1: turning to circular
2: in circular animation
3: turning to wave
4: in wave animation

story2
0: frozen
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
    console.log(path, value, previousValue);

    // if (path === "scene") {
    //   if (value === 1 && previousValue === 2) {
    //   } else if (value === 2 && previousValue === 1) {
    //   }
    // }
  }
);

// FPS
let divFps = document.getElementById("fps");

let showingInspecter = false;
document.querySelector("#inspector").addEventListener("click", () => {
  showingInspecter = !showingInspecter;
  // console.log(g.scene);
  if (showingInspecter) {
    if (g.scene === 1) scene.debugLayer.show();
    else if (g.scene === 2) scene2.debugLayer.show();
  } else {
    if (g.scene === 1) scene.debugLayer.hide();
    else if (g.scene === 2) scene2.debugLayer.hide();
  }
});

document.querySelector("#scene1").addEventListener("click", function () {
  if (g.scene === 1) return;
  // g.scene = 1;
  s2.toScene1().then(() => {
    s1.fromScene2();
  });
});

document.querySelector("#scene2").addEventListener("click", function () {
  if (g.scene === 2) return;
  paperInstance.updateRatio();
  engine.resize();
  s1.toScene2();
  s2.fromScene1();
});

// document.querySelector("#screen").addEventListener("click", function () {
//   if (g.scene === 2 && g.story2 === 2) paperInstance.toScreen();
// });

window.addEventListener("resize", function () {
  paperInstance.updateRatio();
  engine.resize();
});
