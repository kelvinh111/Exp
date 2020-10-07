/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);
    this.plane = null;
    //this.camera = null;

    this.init();
    this.updateRatio();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2,
      1,
      new BABYLON.Vector3(0, 0, 0),
      scene2
    );
    camera2.wheelPrecision = 200;
    camera2.minZ = 0.1;

    var light = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0),
      scene2
    );

    // let glow = new BABYLON.GlowLayer("glow", scene2, {
    //   //mainTextureFixedSize: 512,
    //   blurKernelSize: 16
    // });

    this.plane = BABYLON.Mesh.CreatePlane("map", 1, scene2);
    this.plane.enableEdgesRendering();
    this.plane.edgesWidth = 1.0;
    this.plane.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
    this.plane.setEnabled(false);

    // create a material for the RTT and apply it to the plane
    var rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    rttMaterial.emissiveTexture = renderTarget;
    rttMaterial.disableLighting = true;

    this.plane.material = rttMaterial;

    BABYLON.SceneLoader.AppendAsync(
      "https://public.kelvinh.studio/cdn/3d/bed/",
      "scene.gltf",
      scene2
    ).then((s) => {});

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/macbook6/",
      "scene.gltf",
      scene2,
      (s) => {
        mb2 = s[0];
        mb2.scaling = new BABYLON.Vector3(0.0015, 0.0015, 0.0015);
        mb2.position.x = 0.436;
        mb2.position.y = -0.045;
        mb2.position.z = -0.226;
        mb2.rotation.y = -93.1;

        // mb.position.z = 0.5;
        // mb.position.y = -5;

        // disable loop & manually play it once
        // this.mbAni = scene.animationGroups[0];
        // this.mbAni.loopAnimation = false;
        // this.mbAni.pause();
        // this.mbAni.goToFrame(3.75); // collapse the macbook
      }
    );
  }

  render() {
    scene2.render();
  }

  updateRatio() {
    let y = 2 * camera2.position.length() * Math.tan(camera2.fov / 2);
    let x = y * engine.getAspectRatio(camera2);
    this.plane.scaling.x = x;
    this.plane.scaling.y = y;
  }
}
