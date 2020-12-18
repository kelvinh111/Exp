import onChange from "on-change";
import * as workerTimers from "worker-timers";
import "./styles.scss";
import { stf, htc } from "./util.js";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import MobileDetect from "mobile-detect";

// detect device is desktop/mobile
var md = new MobileDetect(window.navigator.userAgent);
// console.log(md.mobile());
if (md.mobile()) {
  document.body.classList.add("mobile");
} else {
  document.body.classList.add("desktop");
}

// let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
// document.documentElement.style.setProperty("--vh", `${vh}px`);

function onResize(e) {
  // let vh = window.innerHeight * 0.01;
  // document.documentElement.style.setProperty("--vh", `${vh}px`);
  // engine.resize();

  // alert(
  //   window.innerWidth +
  //     " " +
  //     document.body.clientWidth +
  //     " " +
  //     canvas.clientWidth +
  //     ""
  // );

  engine.resize();

  if (s1 && s2) {
    updateCameraFov().then(() => {
      s1.onResize();
      if (g.scene === 1) {
        paperInstance.updateRatio();
      }
    });
  }
}

function updateCameraFov() {
  let deferred = Q.defer();
  let ratio = window.innerWidth / window.innerHeight;
  let s1fov = km.map(ratio, 0.4, 1.3, 1.2, 0.8, true);
  let s2fov = km.map(ratio, 0.4, 1.3, 1.5, 0.8, true);
  if (s1 && camera) {
    gsap.to(camera, {
      duration: 1,
      fov: s1fov,
      onComplete: () => {
        deferred.resolve();
      },
    });
  }
  if (s2 && camera2) {
    gsap.to(camera2, {
      duration: 1,
      fov: s2fov,
      onComplete: () => {
        deferred.resolve();
      },
    });
  }

  if (!s1 && !s2) {
    deferred.resolve();
  }

  return deferred.promise;
}

function init() {
  s1.init();
  s2.init();

  // render once to prepare the scene
  s1.render();
  s2.render();

  onResize();

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

  // this even works when changed to scene2
  // as scene1 is always running and in fullscreen
  scene1.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERMOVE:
        // console.log("POINTER MOVE");
        gsap.to($curRing, {
          duration: 0.1,
          left: pointerInfo.event.clientX + "px",
          top: pointerInfo.event.clientY + "px",
        });

        if (g.scene === 1) {
          s1.onMousemove(pointerInfo.event.clientX, pointerInfo.event.clientY);
        } else {
          s2.onMousemove(pointerInfo.event.clientX, pointerInfo.event.clientY);
        }
        break;
      case BABYLON.PointerEventTypes.POINTERTAP:
        // console.log("POINTER TAP");
        break;
      case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
        // console.log("POINTER DOUBLE-TAP");
        break;
    }
  });
}

// loading screen
// of preloading all assets
let totalCount = 0;
let finishCount = 0;
let loaded = 0;
let dotCount = 20;
let dotDone = 0;
var loadingScreenDiv = window.document.getElementById("loadingScreen");
function customLoadingScreen() {
  // console.log("customLoadingScreen creation");
}
customLoadingScreen.prototype.displayLoadingUI = function () {
  // console.log("customLoadingScreen loading");
};
customLoadingScreen.prototype.hideLoadingUI = function () {
  // console.log("customLoadingScreen loaded");
};
var loadingScreen = new customLoadingScreen();
engine.loadingScreen = loadingScreen;
engine.displayLoadingUI();

ee.addListener("asset-start", (args) => {
  totalCount += args.totalCount;
});

ee.addListener("asset-progress", (args) => {
  finishCount++;
  let index = Math.floor(((finishCount / totalCount) * 100) / (100 / dotCount));
  // console.log(finishCount, index, loaded);

  for (let i = loaded; i < index; i++) {
    gsap.to(document.querySelector(`.dot:nth-child(${i + 1})`), {
      duration: 1,
      scale: 1,
      autoAlpha: 1,
      delay: 0.2 * i,
      onComplete: () => {
        dotDone++;
        if (finishCount === totalCount && dotCount === dotDone) {
          // engine.hideLoadingUI();
          // return;
          gsap.to(loadingScreenDiv, {
            duration: 1.5,
            autoAlpha: 0,
            scale: 1.5,
            display: "none",
            delay: 0.5,
          });
          init();
        }
      },
    });
  }
  loaded = index;
});

/*
ee.addListener("asset-finish", (args) => {
  console.log("loading finished");
  if (finishCount === totalCount && dotCount === dotDone) {
    // engine.hideLoadingUI();
    return;
    gsap.to(loadingScreenDiv, {
      duration: 2,
      autoAlpha: 0,
      display: "none",
    });
    init();
  }
});
*/

// resize
onResize();
window.addEventListener("resize", onResize, false);
window.addEventListener("orientationchange", onResize, false);

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
        $cur.classList.remove("s2");
        $cur.classList.add("s1");
        gsap.to($curDot, {
          duration: 2,
          opacity: 1,
        });
      } else {
        $cur.classList.remove("s1");
        $cur.classList.add("s2");
        gsap.to($curDot, {
          duration: 2,
          opacity: 0,
        });
      }
    }
  }
);

// Scenes management
s1 = new Scene1();
s2 = new Scene2();
