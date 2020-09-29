/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";
import Ring from "./Ring";
import Bulb from "./Bulb";
import Space from "./Space";
import Stage from "./Stage";

export default class Scene1 {
  constructor(options) {
    Object.assign(this, options);

    this.ringsMats = [];

    this.init();
  }

  init() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // rtt
    renderTarget = new BABYLON.RenderTargetTexture("depth", 1024, scene, true);
    scene.customRenderTargets.push(renderTarget);

    camera = new BABYLON.ArcRotateCamera(
      "Camera",
      km.radians(-95),
      km.radians(70),
      65,
      new BABYLON.Vector3(0, 3, 0),
      scene
    );
    // camera.setPosition(new BABYLON.Vector3(30, 5, -20));

    // camera = new BABYLON.UniversalCamera(
    //   "cam1",
    //   new BABYLON.Vector3(0, 0, 0),
    //   scene
    // );
    // camera.position = new BABYLON.Vector3(40, 42, -48);
    // camera.rotation = new BABYLON.Vector3(km.radians(20), km.radians(-41.5), 0);
    // camera.setTarget(BABYLON.Vector3.Zero());
    camera.wheelPrecision = 20;
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight(
      "hemi",
      new BABYLON.Vector3(0, 1, -0.5),
      scene
    );
    // light.intensity =.2

    s1gl = new BABYLON.GlowLayer("glow", scene, {
      //mainTextureFixedSize: 512,
      blurKernelSize: 30
    });

    // Rings
    let ring1, ring2, ring3;
    (() => {
      spsRing = new BABYLON.SolidParticleSystem("spsRing", scene, {
        enableMultiMaterial: true,
        updatable: true
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
          diameter: 0.1
        },
        scene
      );

      for (let i = 0; i < bulbNumTotal; i++) {
        let mat = new BABYLON.StandardMaterial("mat" + i, scene);
        mat.disableLighting = true;
        mat.backFaceCulling = false;
        mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        ringsMats.push(mat);
      }

      spsRing.addShape(circle, nbParticles);
      circle.dispose();
      let mesh = spsRing.buildMesh();

      spsRing.setMultiMaterial(ringsMats);

      ring1 = new Ring(ring1Config);
      ring2 = new Ring(ring2Config);
      ring3 = new Ring(ring3Config);
      spsRing.computeSubMeshes();
      console.log("bulbCount:", bulbCount, "particleCount:", particleCount);

      Q.all([
        ring1.aniDrop(),
        ring1.aniOn(),
        ring2.aniDrop(),
        ring2.aniOn(),
        ring3.aniDrop(),
        ring3.aniOn()
      ])
        .delay(2000)
        .then(() => {
          story = 2;
        });
    })();

    // space
    let space = new Space(spaceConfig);
    let stage = new Stage();

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
        value: camera.alpha
      },
      {
        frame: stf(8.5),
        value: km.radians(-137)
      }
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
        value: camera.beta
      },
      {
        frame: stf(8.5),
        value: km.radians(84)
      }
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
        value: camera.radius
      },
      {
        frame: stf(8.5),
        value: 33
      }
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
        value: km.radians(84)
      },
      {
        frame: stf(1.5),
        value: km.radians(84)
      },
      {
        frame: stf(12),
        value: km.radians(95)
      }
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
        value: 33
      },
      {
        frame: stf(1.5),
        value: 33
      },
      {
        frame: stf(12),
        value: 47
      }
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
        value: camera.target.y
      },
      {
        frame: stf(1.5),
        value: camera.target.y
      },
      {
        frame: stf(5.5),
        value: camera.target.y + 2
      },
      {
        frame: stf(12),
        value: camera.target.y + 3
      }
    ]);
    ani4.setEasingFunction(ease2);
    ani5.setEasingFunction(ease2);
    ani6.setEasingFunction(ease2);

    scene.beginDirectAnimation(
      camera,
      [ani1, ani2, ani3],
      0,
      stf(8.5),
      false,
      1,
      () => {
        scene.beginDirectAnimation(
          camera,
          [ani4, ani5, ani6],
          0,
          stf(12),
          false
        );
      }
    );

    setTimeout(() => {
      stage.openMacbook();
    }, 6000);

    renderTarget.renderList.push(spsRing.mesh);

    scene.registerAfterRender(function () {
      ring1.update();
      ring2.update();
      ring3.update();
      spsRing.setParticles();
    });

    document.querySelector("#circular").addEventListener("click", function () {
      if (story === 0 || story === 1 || story === 2 || story === 3)
        return false;
      story = 1;
      Q.all([ring1.toCircular(), ring2.toCircular(), ring3.toCircular()]).then(
        () => {
          story = 2;
        }
      );
    });

    document.querySelector("#wave").addEventListener("click", function () {
      if (story === 0 || story === 1 || story === 3 || story === 4)
        return false;
      story = 3;
      Q.all([ring1.toWave(), ring2.toWave(), ring3.toWave()]).then(() => {
        story = 4;
      });
    });

    // Inspector
    let showingInspecter = false;
    document.querySelector("#inspector").addEventListener("click", function () {
      showingInspecter = !showingInspecter;
      if (showingInspecter) {
        scene.debugLayer.show();
      } else {
        scene.debugLayer.hide();
      }
    });
  }

  render() {
    scene.render();
  }
}
