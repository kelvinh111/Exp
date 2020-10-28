/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";
import Paper from "./Paper";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);

    this.init();
    paper = new Paper();
    // this.makeJson();
    this.a = 0;
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      paperConfig.cam.alpha,
      paperConfig.cam.beta,
      paperConfig.cam.radius,
      paperConfig.cam.target,
      scene2
    );
    // camera2.wheelPrecision = 200;
    camera2.minZ = 0.1;

    var light = new BABYLON.PointLight(
      "Omni",
      new BABYLON.Vector3(0, 0, 0),
      scene2
    );
    var light2 = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0),
      scene2
    );
  }

  makeJson() {
    let name = "yeah";
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
    scene2.render();
  }
}
