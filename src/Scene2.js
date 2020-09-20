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
      10,
      new BABYLON.Vector3(0, 0, 0),
      scene2
    );

    let glow = new BABYLON.GlowLayer("glow", scene2, {
      //mainTextureFixedSize: 512,
      blurKernelSize: 16
    });

    this.plane = BABYLON.Mesh.CreatePlane("map", 1, scene2);
    this.plane.enableEdgesRendering();
    this.plane.edgesWidth = 4.0;
    this.plane.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

    // create a material for the RTT and apply it to the plane
    var rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    rttMaterial.emissiveTexture = renderTarget;
    rttMaterial.disableLighting = true;

    this.plane.material = rttMaterial;
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
