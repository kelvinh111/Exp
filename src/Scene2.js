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
    this.a = 0;
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      birdConfig.cam.alpha,
      birdConfig.cam.beta,
      birdConfig.cam.radius,
      birdConfig.cam.target,
      scene2
    );
    // camera2.wheelPrecision = 200;
    camera2.minZ = 0.1;

    var pipeline = new BABYLON.DefaultRenderingPipeline(
      "defaultPipeline", // The name of the pipeline
      true, // Do you want the pipeline to use HDR texture?
      scene2, // The scene instance
      [camera2] // The list of cameras to be attached to
    );
    // pipeline.samples = 4;
    pipeline.fxaaEnabled = true;

    // var light = new BABYLON.HemisphericLight(
    //   "HemiLight",
    //   new BABYLON.Vector3(0, 1, 0),
    //   scene2
    // );
    // light.intensity = 0.5;

    // var light = new BABYLON.PointLight(
    //   "light",
    //   new BABYLON.Vector3(0, 1, 0),
    //   scene2
    // );
    // light.diffuse = new BABYLON.Color3(1, 0.7, 0);

    var light2 = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0),
      scene2
    );

    var light = new BABYLON.PointLight(
      "Omni",
      new BABYLON.Vector3(0, 0, 0),
      scene2
    );

    this.godrays = new BABYLON.VolumetricLightScatteringPostProcess(
      "godrays",
      1.0,
      camera2,
      null,
      100,
      BABYLON.Texture.BILINEAR_SAMPLINGMODE,
      engine,
      false,
      scene2
    );
    // godrays.density = 0.3;
    this.godrays.exposure = 0.15;
    // console.log(godrays);

    this.godrays.mesh.material.diffuseTexture = new BABYLON.Texture(
      "https://public.kelvinh.studio/cdn/images/sun4.png",
      scene2,
      true,
      false,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    );
    this.godrays.mesh.material.diffuseTexture.hasAlpha = true;
    this.godrays.mesh.position = new BABYLON.Vector3(0, 200, 200);
    this.godrays.mesh.scaling = new BABYLON.Vector3(300, 300, 300);
    light.position = this.godrays.mesh.position;

    // var light = new BABYLON.HemisphericLight(
    //   "hemiLight",
    //   new BABYLON.Vector3(0, 4, 0),
    //   scene2
    // );
    // light.diffuse = new BABYLON.Color3(1, 0, 0);
    // light.specular = new BABYLON.Color3(0, 1, 0);
    // light.groundColor = new BABYLON.Color3(0, 1, 0);

    this.dome = new BABYLON.PhotoDome(
      "testdome",
      "https://public.kelvinh.studio/cdn/images/sky.jpg",
      {
        resolution: 32,
        size: 1000
      },
      scene2
    );
    // this.dome.position.z = -100;
    this.dome.rotation.z = km.radians(44);

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
    // this.godrays.exposure = km.map(
    //   Math.sin((this.a += 0.04)),
    //   -1,
    //   1,
    //   0.08,
    //   0.15
    // );
    // console.log(this.godrays.exposure)
    scene2.render();
  }
}
