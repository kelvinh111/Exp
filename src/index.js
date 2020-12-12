import onChange from "on-change";
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";

// loading screen
// of preloading all assets
let totalCount = 0;
let finishCount = 0;

function updateCameraFov() {
  let ratio = window.innerWidth / window.innerHeight;
  let s1fov = km.map(ratio, 0.4, 1.3, 1.2, 0.8, true);
  let s2fov = km.map(ratio, 0.4, 1.3, 1.5, 0.8, true);
  if (s1 && camera) {
    gsap.to(camera, { duration: 1, fov: s1fov });
  }
  if (s2 && camera2) {
    gsap.to(camera2, { duration: 1, fov: s2fov });
  }
}

function init() {
  s1.init();
  s2.init();

  updateCameraFov();

  // render once to prepare the scene
  s1.render();
  s2.render();
  paperInstance.updateRatio();

  engine.runRenderLoop(function () {
    divFps.innerHTML = engine.getFps().toFixed() + " FPS";
    s1.render();
    if (g.scene === 2) {
      s2.render();
    }
  });

  // FPS
  let divFps = document.getElementById("fps");

  let showingInspecter = false;
  document.querySelector("#inspector").addEventListener("click", () => {
    showingInspecter = !showingInspecter;
    // console.log(g.scene);
    scene2.debugLayer.show();
    if (showingInspecter) {
      if (g.scene === 1) scene1.debugLayer.show();
      else if (g.scene === 2) scene2.debugLayer.show();
    } else {
      if (g.scene === 1) scene1.debugLayer.hide();
      else if (g.scene === 2) scene2.debugLayer.hide();
    }
  });

  document.querySelector("#scene1").addEventListener("click", function () {
    if (g.scene === 1) return;

    s2.toScene1().then(() => {
      s1.fromScene2();
    });
  });

  document.querySelector("#scene2").addEventListener("click", function () {
    if (g.scene === 2) return;

    if (!scenesAniDone) {
      scenesAniDone = true;
      s2.render();
      s1.toScene2().then(() => {
        s2.fromScene1();
      });
    } else {
      s1.toScene2b().then(() => {
        s2.fromScene1b();
      });
    }
  });

  window.addEventListener("resize", function (e) {
    updateCameraFov();
    engine.resize();
  });

  window.addEventListener("mousemove", (e) => {
    gsap.to($curRing, {
      duration: 0.1,
      left: e.clientX + "px",
      top: e.clientY + "px",
    });

    if (g.scene === 1) {
      s1.onMousemove(e.clientX, e.clientY);
    } else {
      s2.onMousemove(e.clientX, e.clientY);
    }
  });
}

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
    init();
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

    if (g.scene === 1) {
      switch (g.story) {
        case 0:
          camera.detachControl(canvas);
          break;
        default:
          camera.attachControl(canvas, true);
          break;
      }
    } else {
      camera.detachControl(canvas);
    }

    // cursor style
    if (path === "scene") {
      if (g.scene === 1) {
        $cur.classList.remove('s2')
        $cur.classList.add('s1')
        gsap.to($curDot, {
          duration: 2,
          opacity: 1,
        });
      } else {
        $cur.classList.remove('s1')
        $cur.classList.add('s2')
        gsap.to($curDot, {
          duration: 2,
          opacity: 0,
        });
      }
    }
  }
);
