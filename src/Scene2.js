import { stf, htc } from "./util.js";
import Paper from "./Paper";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);

    this.a = 0;

    this.preinit();

    // this.makeJson();
  }

  preinit() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("5F779E");
    scene2.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    scene2.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene2.fogColor = htc("5F779E");
    scene2.fogStart = 80;
    scene2.fogEnd = 300.0;
    scene2.autoClear = false; // Color buffer
    // scene2.autoClearDepthAndStencil = false;

    // load all assets
    var assetsManager = new BABYLON.AssetsManager(scene2);

    var flowerTask = assetsManager.addMeshTask(
      "flower",
      "",
      "https://public.kelvinh.studio/cdn/3d/flower/",
      "flower.gltf"
    );

    flowerTask.onSuccess = function (task) {
      flowerGltf = task.loadedMeshes;
      flower = flowerGltf[0];
    };

    var trashTask = assetsManager.addMeshTask(
      "trash",
      "",
      `https://public.kelvinh.studio/cdn/3d/trashbin/`,
      `trashbin.gltf`
    );

    trashTask.onSuccess = function (task) {
      trashGltf = task.loadedMeshes;
      trash = trashGltf[0];
    };

    var paperTask = assetsManager.addMeshTask(
      "paper",
      "",
      `https://public.kelvinh.studio/cdn/3d/${ori}/`,
      `${ori} _ 0PercentFolded.obj`
    );

    paperTask.onSuccess = function (task) {
      paperGltf = task.loadedMeshes;
      paperMesh = paperGltf[0];
    };

    assetsManager.onProgress = function (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) {
      ee.emitEvent("asset-progress", [
        {
          scene: 2,
          remainingCount,
          totalCount,
        },
      ]);
    };

    assetsManager.onFinish = function (tasks) {
      ee.emitEvent("asset-finish", [
        {
          scene: 2,
          tasks,
        },
      ]);
    };

    ee.emitEvent("asset-start", [
      {
        scene: 2,
        totalCount: 3,
      },
    ]);

    assetsManager.load();
  }

  init() {
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera2",
      paperConfig.cam.alpha,
      paperConfig.cam.beta,
      paperConfig.cam.radius,
      paperConfig.cam.target,
      scene2
    );
    camera2.minZ = 0.1;
    camera2.panningSensibility = 0;

    paperInstance = new Paper();

    s2light = new BABYLON.DirectionalLight(
      "light",
      new BABYLON.Vector3(0, -0.4, 0),
      scene2
    );
    s2light.position = new BABYLON.Vector3(0, 10, 0);
    // s2light.direction = new BABYLON.Vector3(-0.1, -10, -0.1);
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
    ground.material.freeze();
    ground.freezeWorldMatrix();
    ground.freezeNormals();

    let ground2 = BABYLON.MeshBuilder.CreateGround(
      "ground2",
      { width: 1000, height: 1000 },
      scene2
    );
    ground2.position.y = -20.1;
    ground2.material = new BABYLON.StandardMaterial("ground2", scene2);
    ground2.material.diffuseColor = htc("B7A9AD");
    ground2.material.specularColor = htc("261C19");
    ground2.material.freeze();
    ground2.freezeWorldMatrix();
    ground2.freezeNormals();

    let sky = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1500 },
      scene2
    );
    sky.material = new BABYLON.StandardMaterial("sky", scene2);
    sky.material.emissiveColor = htc("ff0000");
    sky.material.backFaceCulling = false;
    sky.material.disableLighting = true;
    sky.material.freeze();
    sky.freezeWorldMatrix();
    sky.freezeNormals();

    /*
    let dt = 6;
    let db = 5;
    
    // max 26 chars
    let texts = [
      "CHRONIC ISSUE DEPRESSION",
      "REALITY EXHAUSTION PAIN",
      "FAILURE ANXIETY DESPAIR",
      "WORTHLESS INSIGNIFICANT",
      "BITTERNESS BURNOUT NUMB ",
    ];
    texts = texts.reverse();
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
          sideOrientation: BABYLON.Mesh.FRONTSIDE,
        },
        scene2
      );
      ring.position.y = i * 2 - 20 + 1;
      dt++;
      db++;

      //Create dynamic texture
      var texture = new BABYLON.DynamicTexture(
        "dynamic texture",
        { width: 1024, height: 70 },
        scene2
      );

      var material = new BABYLON.StandardMaterial("Mat", scene2);
      material.alpha = 1;
      material.diffuseTexture = texture;
      material.opacityTexture = texture;
      material.diffuseTexture.hasAlpha = true;
      material.backFaceCulling = false;

      //Add text to dynamic texture
      var font = "normal 70px 'Sabon LT Std', serif";
      texture.drawText(
        texts[i], // 20 chars
        0,
        68,
        font,
        "black",
        "transparent",
        true,
        true
      );

      ring.material = material;
      ring.speed = Math.random() * 0.006 + 0.004;

      this.rings.push(ring);
    }
    */

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
        diameterBottom: 6,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      },
      scene2
    );
    pot.position.y = -17;
    pot.material = mat;
    // pot.material.freeze();
    pot.freezeWorldMatrix();
    pot.freezeNormals();
    shadowGenerator.getShadowMap().renderList.push(pot);

    // var potBottom = BABYLON.MeshBuilder.CreateDisc(
    //   "disc",
    //   { radius: 2.5 },
    //   scene2
    // );
    // potBottom.rotation.x = Math.PI / 2;
    // potBottom.position.y = -19.9;
    // potBottom.material = new BABYLON.StandardMaterial("pb", scene2);
    // potBottom.material.diffuseColor = htc("121C2D");
    // potBottom.material.emissiveColor = htc("000000");

    flower.scaling = new BABYLON.Vector3(1, 1, 1);
    flower.position.y = -14;
    flowerGltf.forEach((v) => {
      shadowGenerator.getShadowMap().renderList.push(v);
      v.material = mat;
    });
    flower.freezeWorldMatrix();
    flower.freezeNormals();

    // trash
    trash.position = new BABYLON.Vector3(0, -20.25, 0);
    trash.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    trash.scaling = new BABYLON.Vector3(9.5, 9.5, -9.5);
    trash._children[0].overlayColor = htc("3F5373");
    trash._children[0].renderOverlay = true;
    trash._children[0].material.freeze();
    trash.freezeWorldMatrix();
    trash.freezeNormals();
  }

  showText(active) {
    if (active) {
      gsap.to($s2, {
        duration: 2,
        autoAlpha: 1,
        display: "block",
      });
    } else {
      gsap.to($s2, {
        duration: 2,
        autoAlpha: 0,
        display: "none",
      });
    }
  }

  toScene1() {
    var deferred = Q.defer();
    g.story2 = 3;
    this.showText(false);
    paperInstance.toScreen().then(() => {
      $cur.classList.remove("focus");
      g.scene = 1;
      g.story2 = 0;
      deferred.resolve();
    });
    return deferred.promise;
  }

  fromScene1() {
    // console.log("s2 from s1");
    g.story2 = 1;

    paperInstance.toPaper().then(() => {
      this.showText(true);
      scene2AniDone = true;
      g.story2 = 2;
    });
  }

  fromScene1b() {
    // console.log("s2 from s1 b");
    g.story2 = 1;
    paperInstance.toPaperb().then(() => {
      this.showText(true);
      g.story2 = 2;
    });
  }

  onMousemove(x, y) {
    gsap.to($curDot, { duration: 0.3, left: x + "px", top: y + "px" });
    if (g.story2 === 2) {
      // pot & flower shadow
      gsap.to(s2light.direction, {
        duration: 1,
        x: km.map(x / window.innerWidth, 0, 1, -1, -0.6),
        y: km.map(y / window.innerHeight, 0, 1, -0.6, -0.38),
      });
    }
  }

  makeJson() {
    let name = "crumbled";
    let crumbled = [];
    for (let i = 0; i <= 100; i++) {
      BABYLON.SceneLoader.ImportMesh(
        "",
        `https://public.kelvinh.studio/cdn/3d/${name}/`,
        `${name} _ ${i}PercentFolded.obj`,
        scene2,
        (s) => {
          let b = s[0];
          var pos = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
          crumbled[i] = pos;
          if (i === 100) {
            console.log(i, JSON.stringify(crumbled));
          }
        }
      );
    }
  }

  eventHandler() {}

  eventUnhandler() {}

  render() {
    // this.rings.forEach((v) => {
    //   v.rotation.y -= v.speed;
    // });
    scene2.render();
  }
}
