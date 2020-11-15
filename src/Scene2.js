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
    /*
    scene2 = new BABYLON.Scene(engine);
    // scene2.clearColor = new BABYLON.Color3(1, 1, 1);
    // scene2.clearColor = htc("ff00ff");
    // scene2.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    // scene2.fogColor = htc('ffffff')
    // scene2.fogDensity = 0.01;
    // scene2.fogStart = 60;
    // scene2.fogEnd = 120.0;

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

    var light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, -1),
      scene2
    );
    light.diffuse = htc("FFC883");
    light.ground = htc("FFC883");
    light.intensity = 0.65;

    var light2 = new BABYLON.DirectionalLight(
      "light2",
      new BABYLON.Vector3(0, -1, -2),
      scene2
    );
    light2.position = new BABYLON.Vector3(0, 0, 20);
    light2.intensity = 0.9;
    light2.diffuse = htc("FFC883");
    light2.specular = new BABYLON.Color3(0, 0, 0);

    var ground = BABYLON.Mesh.CreatePlane("ground", 3000, scene2);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -20;
    // ground.material = new BABYLON.ShadowOnlyMaterial("ground", scene2);
    ground.receiveShadows = true;
    ground.material = new BABYLON.StandardMaterial("ground", scene2);
    // ground.material.emissiveColor = new BABYLON.Color3(1,1,1)

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
      material.diffuseTexture.vAng = Math.PI;
      material.backFaceCulling = false;

      //Add text to dynamic texture
      var font = "bold 92px sans-serif";
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

    var pot = BABYLON.CylinderBuilder.CreateCylinder(
      "pot",
      {
        height: 4,
        diameterTop: 7,
        diameterBottom: 5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      scene2
    );
    pot.position.y = -18;

    var mat = new BABYLON.StandardMaterial("mat", scene2);
    mat.diffuseTexture = new BABYLON.Texture(
      "https://public.kelvinh.studio/cdn/images/white.png",
      scene2
    );
    mat.diffuseTexture.hasAlpha = true;
    mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;
    mat.useAlphaFromDiffuseTexture = true;
    mat.alpha = 0;

    var potBottom = BABYLON.MeshBuilder.CreateDisc(
      "disc",
      { radius: 2.5 },
      scene2
    );
    potBottom.rotation.x = Math.PI / 2;
    potBottom.position.y = -19.9;
    potBottom.material = new BABYLON.StandardMaterial("pb", scene2);
    potBottom.material.diffuseColor = htc("FFC883");
    // potBottom.material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    // light.includedOnlyMeshes = [ground];
    light2.includedOnlyMeshes = [ground, pot];

    // potBottom.receiveShadows = true

    function mat_alpha(obj) {
      // console.log(obj.name);
      if (
        obj.hasOwnProperty("_material") &&
        obj._material &&
        typeof obj._material === "object"
      ) {
        obj._material = mat;
      }

      if (obj.hasOwnProperty("_children") && Array.isArray(obj._children)) {
        obj._children.forEach((v) => {
          mat_alpha(v);
        });
      }
    }

    var sg = new BABYLON.ShadowGenerator(1024, light2);
    sg.useBlurExponentialShadowMap = true;
    // sg.blurScale = 2;
    sg.usePercentageCloserFiltering = true;
    sg.blurBoxOffset = 2;
    // sg.usePoissonSampling = true;
    sg.setDarkness(0);
    sg.addShadowCaster(pot);
    sg.enableSoftTransparentShadow = true;
    sg.transparencyShadow = true;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/colored_flower/",
      "scene2.gltf",
      scene2,
      (s) => {
        mb = s[0];
        sg.getShadowMap().renderList.push(mb);

        pot.material = mat;
        mat_alpha(mb);

        mb.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
        mb.position = new BABYLON.Vector3(0, 2, 0);
        mb.parent = pot;
      }
    );
    */

    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("1D3358");
    scene2.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    scene2.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene2.fogColor = htc("1D3358");
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

    var light = new BABYLON.DirectionalLight(
      "light",
      new BABYLON.Vector3(0, -0.4, 1),
      scene2
    );
    light.intensity = 0.5;

    var light2 = new BABYLON.HemisphericLight(
      "light2",
      new BABYLON.Vector3(0, 0.5, 0),
      scene2
    );
    light.intensity = 0.8;

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

    var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
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
        height: 4,
        diameterTop: 7,
        diameterBottom: 5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      scene2
    );
    pot.position.y = -18;
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
    potBottom.material.diffuseColor = htc("1E2A3F");
    potBottom.material.emissiveColor = htc("000000");

    BABYLON.SceneLoader.ImportMesh(
      "",
      "https://public.kelvinh.studio/cdn/3d/fah/",
      "fah.gltf",
      scene2,
      function (sc) {
        sc[0].scaling = new BABYLON.Vector3(20, 20, 20);
        sc[0].position.y = -16;
        sc.forEach((v) => {
          shadowGenerator.getShadowMap().renderList.push(v);
          v.material = mat;
        });
      }
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
    this.rings.forEach((v) => {
      v.rotation.y += v.speed;
    });
    scene2.render();
  }
}
