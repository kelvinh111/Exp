import * as workerTimers from "worker-timers";
import { stf, htc } from "./util.js";
import Ring from "./Ring";
import Bulb from "./Bulb";
import Space from "./Space";
import Stage from "./Stage";

export default class Scene1 {
  constructor(options) {
    Object.assign(this, options);

    this.ring1 = null;
    this.ring2 = null;
    this.ring3 = null;
    this.ringsMats = [];

    this.space = null;
    this.stage = null;

    this.namePos = {};
    this.mbPos = {};
    this.needsUpdateMb = false;

    // 0: nothing
    // 1: name
    // 2: mb
    this.hover = 0;

    this.preinit();
  }

  preinit() {
    scene1 = new BABYLON.Scene(engine);
    scene1.clearColor = new BABYLON.Color3(0, 0, 0);

    // load all assets
    var assetsManager = new BABYLON.AssetsManager(scene1);

    var macbookTask = assetsManager.addMeshTask(
      "macbook",
      "",
      "https://public.kelvinh.studio/cdn/3d/macbook6/",
      "scene.gltf"
    );

    macbookTask.onSuccess = function (task) {
      mb = task.loadedMeshes[0];
    };

    assetsManager.onProgress = function (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) {
      ee.emitEvent("asset-progress", [
        {
          scene: 1,
          remainingCount,
          totalCount,
        },
      ]);
    };

    assetsManager.onFinish = function (tasks) {
      ee.emitEvent("asset-finish", [
        {
          scene: 1,
          tasks,
        },
      ]);
    };

    ee.emitEvent("asset-start", [
      {
        scene: 1,
        totalCount: 1,
      },
    ]);

    assetsManager.load();
  }

  init() {
    // rtt
    renderTarget = new BABYLON.RenderTargetTexture("depth", 1024, scene1, true);
    scene1.customRenderTargets.push(renderTarget);

    camera = new BABYLON.ArcRotateCamera(
      "Camera",
      km.radians(-95),
      km.radians(70),
      65,
      new BABYLON.Vector3(0, 4, 0),
      scene1
    );
    camera.minZ = 0.1;
    camera.panningSensibility = 0;

    var light = new BABYLON.HemisphericLight(
      "hemi",
      new BABYLON.Vector3(0, 1, -0.5),
      scene1
    );
    light.diffuse = htc("b1bbff");

    s1gl = new BABYLON.GlowLayer("glow", scene1, {
      //mainTextureFixedSize: 512,
      blurKernelSize: 30,
    });

    // mouse cursor
    gsap.to($curRing, { duration: 2, delay: 0.5, opacity: 1 });
    gsap.to($curDot, { duration: 2, delay: 1, opacity: 1 });

    this.initRings();
    this.space = new Space(spaceConfig);
    this.stage = new Stage();
    this.initIntro();
    this.initClickable();
  }

  initClickable() {
    camera.onProjectionMatrixChangedObservable.add(() => {
      this.needsUpdateMb = true;
    });

    camera.onViewMatrixChangedObservable.add(() => {
      this.needsUpdateMb = true;
    });
  }

  initRings() {
    spsRing = new BABYLON.SolidParticleSystem("spsRing", scene1, {
      enableMultiMaterial: true,
      updatable: true,
    });
    // needa rotate bulb's core thus not billboard
    spsRing.computeBoundingBox = true;
    spsRing.billboard = false;
    spsRing.computeParticleRotation = true;
    spsRing.computeParticleColor = false;
    spsRing.computeParticleTexture = false;
    spsRing.computeParticleVertex = false;

    let circle = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      {
        segments: 3,
        diameter: 0.1,
      },
      scene1
    );

    for (let i = 0; i < bulbNumTotal; i++) {
      let mat = new BABYLON.StandardMaterial("mat" + i, scene1);
      mat.disableLighting = true;
      mat.backFaceCulling = false;
      mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
      ringsMats.push(mat);
    }

    spsRing.addShape(circle, nbParticles);
    circle.dispose();
    let mesh = spsRing.buildMesh();

    spsRing.setMultiMaterial(ringsMats);

    this.ring1 = new Ring(ring1Config);
    this.ring2 = new Ring(ring2Config);
    this.ring3 = new Ring(ring3Config);
    spsRing.computeSubMeshes();
    renderTarget.renderList.push(spsRing.mesh);
    // console.log("bulbCount:", bulbCount, "particleCount:", particleCount);

    Q.all([
      this.ring1.aniDrop(),
      this.ring1.aniOn(),
      this.ring2.aniDrop(),
      this.ring2.aniOn(),
      this.ring3.aniDrop(),
      this.ring3.aniOn(),
    ])
      // .delay(1200)
      .then(() => {
        workerTimers.setTimeout(() => {
          let alpha = -137;
          let beta = 95;
          let radius = 47;
          camera.wheelPrecision = 20;
          camera.lowerAlphaLimit = km.radians(-150);
          camera.upperAlphaLimit = km.radians(-25);
          camera.lowerBetaLimit = km.radians(beta - 20);
          camera.upperBetaLimit = km.radians(beta + 9.6);
          // camera.lowerRadiusLimit = km.radians(radius - 5);
          // camera.upperRadiusLimit = km.radians(radius + 5);
          camera.angularSensibilityX = 12000;
          camera.angularSensibilityY = 12000;
          camera.lowerRadiusLimit = camera.radius;
          camera.upperRadiusLimit = camera.radius;

          g.story = 2;
        }, 1200);
      });

    this.eventHandler();
  }

  initIntro() {
    var ease1 = new BABYLON.BezierCurveEase(0, 0, 0.75, 1);
    var ease2 = new BABYLON.BezierCurveEase(0, 0, 0.6, 1);

    var ani1 = new BABYLON.Animation(
      "ani1",
      "alpha",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani1.setKeys([
      {
        frame: 0,
        value: camera.alpha,
      },
      {
        frame: stf(8.5),
        value: km.radians(-137),
      },
    ]);

    var ani2 = new BABYLON.Animation(
      "ani1",
      "beta",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani2.setKeys([
      {
        frame: 0,
        value: camera.beta,
      },
      {
        frame: stf(8.5),
        value: km.radians(74),
      },
    ]);

    var ani3 = new BABYLON.Animation(
      "ani1",
      "radius",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani3.setKeys([
      {
        frame: 0,
        value: camera.radius,
      },
      {
        frame: stf(8.5),
        value: 33,
      },
    ]);
    ani1.setEasingFunction(ease1);
    ani2.setEasingFunction(ease1);
    ani3.setEasingFunction(ease1);

    var ani4 = new BABYLON.Animation(
      "ani1",
      "beta",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani4.setKeys([
      {
        frame: 0,
        value: km.radians(74),
      },
      {
        frame: stf(1.5),
        value: km.radians(74),
      },
      {
        frame: stf(13),
        value: km.radians(95),
      },
    ]);

    var ani5 = new BABYLON.Animation(
      "ani1",
      "radius",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani5.setKeys([
      {
        frame: 0,
        value: 33,
      },
      {
        frame: stf(1.5),
        value: 33,
      },
      {
        frame: stf(13),
        value: 47,
      },
    ]);

    var ani6 = new BABYLON.Animation(
      "ani1",
      "target.y",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani6.setKeys([
      {
        frame: 0,
        value: camera.target.y,
      },
      {
        frame: stf(1.5),
        value: camera.target.y,
      },
      {
        frame: stf(5.5),
        value: camera.target.y + 2,
      },
      {
        frame: stf(13),
        value: camera.target.y + 3,
      },
    ]);
    ani4.setEasingFunction(ease2);
    ani5.setEasingFunction(ease2);
    ani6.setEasingFunction(ease2);

    scene1.beginDirectAnimation(
      camera,
      [ani1, ani2, ani3],
      0,
      stf(8.5),
      false,
      1,
      () => {
        scene1.beginDirectAnimation(
          camera,
          [ani4, ani5, ani6],
          0,
          stf(13),
          false
        );
      }
    );

    workerTimers.setTimeout(() => {
      this.stage.openMacbook();
    }, 6700);

    workerTimers.setTimeout(() => {
      this.showText(true);
    }, 9000);
  }

  showText(active) {
    if (active) {
      gsap.to($s1, {
        duration: 3,
        opacity: 1,
      });
    } else {
      gsap.to($s1, {
        duration: 3,
        opacity: 0,
      });
    }
  }

  toScene2() {
    // console.log("s1 to s2");
    let deferred = Q.defer();
    paperInstance.updateRatio();
    this.eventUnhandler();

    workerTimers.setTimeout(() => {
      this.showText(false);
      $cur.classList.remove("focus");
      g.scene = 2;
      deferred.resolve();
    }, 0);

    return deferred.promise;
  }

  toScene2b() {
    // console.log("s1 to s2b");
    let deferred = Q.defer();
    this.eventUnhandler();

    var ani = new BABYLON.Animation(
      "aniYeah",
      "target.y",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani.setKeys([
      {
        frame: 0,
        value: camera.target.y,
      },
      {
        frame: stf(4),
        value: 50,
      },
    ]);

    this.showText(false);
    $cur.classList.remove("focus");
    scene1.beginDirectAnimation(camera, [ani], 0, stf(4), false, 1, () => {
      g.scene = 2;
      deferred.resolve();
    });

    return deferred.promise;
  }

  fromScene2() {
    // console.log("s1 from s2");

    this.showText(true);
    var ani = new BABYLON.Animation(
      "aniYeah",
      "target.y",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani.setKeys([
      {
        frame: 0,
        value: 70,
      },
      {
        frame: stf(4),
        value: 7,
      },
    ]);

    let ease = new BABYLON.SineEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    ani.setEasingFunction(ease);
    scene1.beginDirectAnimation(camera, [ani], 0, stf(4), false, 1, () => {
      this.eventHandler();
    });
  }

  eventHandler() {
    if (debug) {
      document.querySelector("#circular").addEventListener("click", () => {
        if (g.story === 0 || g.story === 1 || g.story === 2 || g.story === 3)
          return false;
        g.story = 1;
        Q.all([
          this.ring1.toCircular(),
          this.ring2.toCircular(),
          this.ring3.toCircular(),
        ]).then(() => {
          g.story = 2;
        });
      });

      document.querySelector("#wave").addEventListener("click", () => {
        if (g.story === 0 || g.story === 1 || g.story === 3 || g.story === 4)
          return false;
        g.story = 3;
        Q.all([
          this.ring1.toWave(),
          this.ring2.toWave(),
          this.ring3.toWave(),
        ]).then(() => {
          g.story = 4;
        });
      });
    }

    scene1.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERTAP:
          if (
            this.isHoverName(
              pointerInfo.event.clientX,
              pointerInfo.event.clientY
            )
          ) {
            // go scene2
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
          } else if (
            this.isHoverMb(pointerInfo.event.clientX, pointerInfo.event.clientY)
          ) {
            // circular / wave
            if (g.story === 2) {
              g.story = 3;
              Q.all([
                this.ring1.toWave(),
                this.ring2.toWave(),
                this.ring3.toWave(),
              ]).then(() => {
                g.story = 4;
              });
            }
            if (g.story === 4) {
              g.story = 1;
              Q.all([
                this.ring1.toCircular(),
                this.ring2.toCircular(),
                this.ring3.toCircular(),
              ]).then(() => {
                g.story = 2;
              });
            }
          }
          break;
      }
    });

    scene1.registerAfterRender(() => {
      if (this.ring1 && this.ring2 && this.ring3) {
        this.ring1.update();
        this.ring2.update();
        this.ring3.update();
      }
      spsRing.setParticles();

      if (this.needsUpdateMb) {
        const pos = BABYLON.Vector3.Project(
          mb.getAbsolutePosition(),
          BABYLON.Matrix.IdentityReadOnly,
          scene1.getTransformMatrix(),
          camera.viewport.toGlobal(
            engine.getRenderWidth(),
            engine.getRenderHeight()
          )
        );
        this.mbPos.x = pos.x;
        this.mbPos.y = pos.y;

        this.needsUpdateMb = false;
      }
    });
  }

  eventUnhandler() {}

  onResize() {
    let rect = $name.getBoundingClientRect();
    this.namePos = {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    };
  }

  isHoverMb(x, y) {
    return (
      g.scene === 1 &&
      g.story !== 0 &&
      km.dist(x, y, this.mbPos.x, this.mbPos.y) < 150
    );
  }

  isHoverName(x, y) {
    return (
      g.scene === 1 &&
      g.story !== 0 &&
      x > this.namePos.left - 5 &&
      x < this.namePos.right + 5 &&
      y > this.namePos.top - 3 &&
      y < this.namePos.bottom + 3
    );
  }

  onMousemove(x, y) {
    if (this.isHoverMb(x, y)) {
      if (!$cur.classList.contains("focus")) {
        $cur.classList.add("focus");
        gsap.to($curDot, {
          duration: 0.6,
          left: this.mbPos.x + "px",
          top: this.mbPos.y - 20 + "px",
        });
      }
    } else if (this.isHoverName(x, y)) {
      if (!$cur.classList.contains("focus")) {
        $cur.classList.add("focus");
        gsap.to($curDot, {
          duration: 0.6,
          left: (this.namePos.left + this.namePos.right) / 2 + "px",
          top: (this.namePos.top + this.namePos.bottom) / 2 + "px",
        });
      }
    } else {
      if ($cur.classList.contains("focus")) {
        $cur.classList.remove("focus");
      }
      gsap.to($curDot, { duration: 0.3, left: x + "px", top: y + "px" });
    }
  }

  render() {
    scene1.render();
  }
}
