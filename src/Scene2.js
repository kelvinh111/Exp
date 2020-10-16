/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";
import Bird from "./Bird";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);

    this.init();
    bird = new Bird();
    // this.makeJson();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      birdConfig.cam.beta,
      birdConfig.cam.radius,
      birdConfig.cam.target,
      scene2
    );
    // camera2.wheelPrecision = 200;
    camera2.minZ = 0.1;

    // var light = new BABYLON.HemisphericLight(
    //   "HemiLight",
    //   new BABYLON.Vector3(0, 1, 0),
    //   scene2
    // );
    // light.intensity = 0.5;

    // var light2 = new BABYLON.PointLight(
    //   "light",
    //   new BABYLON.Vector3(0, 1, 0),
    //   scene2
    // );
    // light2.diffuse = new BABYLON.Color3(1, 1, 1);

    var light2 = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0),
      scene2
    );

    this.dome = new BABYLON.PhotoDome(
      "testdome",
      "https://public.kelvinh.studio/cdn/images/sky6.png",
      {
        resolution: 32,
        size: 1000
      },
      scene2
    );
    // this.dome.position.z = -100;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/birdcage/",
      "scene.gltf",
      scene2,
      (s) => {
        cage = s[0];
        cage.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        cage.position.y = -30;
        cage.setEnabled(false);
      }
    );
  }

  makeJson() {
    let name = "bird4";
    let yeah = [];
    for (let i = 0; i <= 100; i++) {
      BABYLON.SceneLoader.ImportMesh(
        "",
        `https://public.kelvinh.studio/cdn/3d/${name}/`,
        `${name} _ ${i}PercentFolded.obj`,
        scene2,
        (s) => {
          let b = s[0];
          var pos = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
          yeah[i] = pos;
          if (i === 100) {
            console.log(i, JSON.stringify(yeah));
          }
        }
      );
    }
  }

  render() {
    if (g.story2 === 2) {
      bird.flap();
    }
    if (g.story2 === 3) {
      bird.flap();
      bird.fly();
    }
    scene2.render();
  }
}
