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
    scene2.clearColor = htc("5F779E");
    scene2.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    scene2.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene2.fogColor = htc("5F779E");
    // scene2.fogDensity = 0.01;
    scene2.fogStart = 80;
    scene2.fogEnd = 300.0;

    camera2 = new BABYLON.ArcRotateCamera(
      "Camera2",
      paperConfig.cam.alpha,
      paperConfig.cam.beta,
      paperConfig.cam.radius,
      paperConfig.cam.target,
      scene2
    );
    // camera2.attachControl(canvas, true);
    // camera2.wheelPrecision = 200;
    camera2.minZ = 0.1;

    s2light = new BABYLON.DirectionalLight(
      "light",
      new BABYLON.Vector3(0, -0.4, 0),
      scene2
    );
    s2light.position = new BABYLON.Vector3(0, 10, 0);
    s2light.intensity = 0.8;

    var light2 = new BABYLON.HemisphericLight(
      "light2",
      new BABYLON.Vector3(0, 0.5, 0),
      scene2
    );

    var ground = BABYLON.Mesh.CreatePlane("ground", 1000, scene2);
    ground.rotation.x = Math.PI / 2;
    ground.material = new BABYLON.ShadowOnlyMaterial("mat", scene2);
    ground.material.shadowColor = htc("4472a7");
    ground.receiveShadows = true;
    ground.position.y = -20;

    let ground2 = BABYLON.MeshBuilder.CreateGround(
      "ground2",
      { width: 1000, height: 1000 },
      scene2
    );
    ground2.position.y = -20.1;
    ground2.material = new BABYLON.StandardMaterial("ground2", scene2);
    ground2.material.diffuseColor = htc("B7A9AD");
    ground2.material.specularColor = htc("261C19");

    let sky = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1500 },
      scene2
    );
    sky.material = new BABYLON.StandardMaterial("sky", scene2);
    sky.material.emissiveColor = htc("ff0000");
    sky.material.backFaceCulling = false;
    sky.material.disableLighting = true;

    let dt = 6;
    let db = 5;
    this.rings = [];

    for (let i = 0; i < 5; i++) {
      var ring = BABYLON.CylinderBuilder.CreateCylinder(
        "ring" + i,
        {
          height: 2,
          diameterTop: dt,
          diameterBottom: db,
          cap: BABYLON.Mesh.NO_CAP,
          enclose: false,
          sideOrientation: BABYLON.Mesh.DOUBLESIDE
        },
        scene2
      );
      ring.position.y = i * 2 - 20 + 1;
      dt++;
      db++;

      //Create dynamic texture
      // var textureResolution = 256;
      var texture = new BABYLON.DynamicTexture(
        "dynamic texture",
        { width: 1024, height: 70 },
        scene2
      );
      // var textureContext = texture.getContext();

      var material = new BABYLON.StandardMaterial("Mat", scene2);
      material.alpha = 1;
      material.diffuseTexture = texture;
      material.diffuseTexture.hasAlpha = true;
      // material.diffuseTexture.vAng = Math.PI;
      material.backFaceCulling = false;
      // material.emissiveColor = new BABYLON.Color3(1, 1, 1)

      //Add text to dynamic texture
      var font = "normal 92px 'Crimson Text', sans-serif";
      texture.drawText(
        "ASDF ASDFJKDASF FASDF FK",
        0,
        68,
        font,
        "black",
        "transparent",
        true,
        true
      );

      ring.material = material;
      ring.speed = Math.random() * 0.01;

      this.rings.push(ring);
    }

    var shadowGenerator = new BABYLON.ShadowGenerator(512, s2light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 1;
    shadowGenerator.setDarkness(0);

    var mat = new BABYLON.StandardMaterial("mat", scene2);
    mat.diffuseTexture = new BABYLON.Texture(
      "https://public.kelvinh.studio/cdn/images/white.png",
      scene2
    );
    mat.diffuseTexture.hasAlpha = true;
    mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATEST;
    mat.useAlphaFromDiffuseTexture = true;
    mat.alpha = 0;

    var pot = BABYLON.CylinderBuilder.CreateCylinder(
      "pot",
      {
        height: 6,
        diameterTop: 7,
        diameterBottom: 5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      scene2
    );
    pot.position.y = -17;
    pot.material = mat;
    shadowGenerator.getShadowMap().renderList.push(pot);

    var potBottom = BABYLON.MeshBuilder.CreateDisc(
      "disc",
      { radius: 2.5 },
      scene2
    );
    potBottom.rotation.x = Math.PI / 2;
    potBottom.position.y = -19.9;
    potBottom.material = new BABYLON.StandardMaterial("pb", scene2);
    potBottom.material.diffuseColor = htc("121C2D");
    potBottom.material.emissiveColor = htc("000000");

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/fah/",
      "fah.gltf",
      scene2,
      function (sc) {
        flower = sc[0];
        flower.scaling = new BABYLON.Vector3(1, 1, 1);
        flower.position.y = -14;
        sc.forEach((v) => {
          shadowGenerator.getShadowMap().renderList.push(v);
          v.material = mat;
        });
      }
    );
  }

  animate() {
    paper.toPaper();
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
    this.rings.forEach((v) => {
      v.rotation.y += v.speed;
    });
    scene2.render();
  }
}
