/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import Bird from "./Bird.js";
import { stf, htc } from "./util.js";

export default class Stage2 {
  constructor(options) {
    Object.assign(this, options);

    this.init();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      0,
      7,
      new BABYLON.Vector3(0, 0, 0),
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

    this.rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    this.rttMaterial.emissiveTexture = renderTarget;
    this.rttMaterial.disableLighting = true;
    this.rttMaterial.backFaceCulling = false;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/birdcage/",
      "scene.gltf",
      scene2,
      (s) => {
        this.cage = s[0];
        this.cage.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        this.cage.position.y = -30;
        this.cage.setEnabled(false);
      }
    );

    this.bird = new Bird();
  }

  render() {
    if (story2 === 2) {
      this.bird.flap();
    }
    if (story2 === 3) {
      this.bird.flap();
      this.bird.fly();
    }
    scene2.render();
  }
}
