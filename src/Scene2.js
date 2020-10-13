/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { BasisTranscodeConfiguration } from "babylonjs";
import { stf, htc } from "./util.js";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);

    this.ori = "bird4";
    this.deltaFlap = 0;
    this.deltaFly = 0;

    this.init();

    // this.makeJson();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      // Math.PI / 2,
      0,
      30,
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

    // this.dome = new BABYLON.PhotoDome(
    //   "testdome",
    //   "https://public.kelvinh.studio/cdn/images/sky1.png",
    //   {
    //     resolution: 32,
    //     size: 1000
    //   },
    //   scene2
    // );
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
        let cage = s[0];
        cage.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        cage.position.y = -40;
      }
    );

    this.birdJson = [];
    BABYLON.SceneLoader.ImportMesh(
      [],
      `https://public.kelvinh.studio/cdn/3d/${this.ori}/`,
      `${this.ori} _ 0PercentFolded.obj`,
      scene2,
      (s) => {
        // console.log(s[0])
        this.bird = s[0];
        this.birdSize = this.bird.getBoundingInfo().boundingBox.extendSize;
        this.updateRatio();

        this.bird.material = this.rttMaterial;
        this.bird.enableEdgesRendering();
        this.bird.edgesWidth = 3.0;
        this.bird.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        // prepare for flapping vertices data
        var pos = this.bird.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.bird.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);
      }
    );

    // fetch flapping vertices data
    fetch(`https://public.kelvinh.studio/cdn/3d/${this.ori}/${this.ori}.json`)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        // fix incorrect frame
        myJson[28].forEach((v, k) => {
          myJson[29][k] = (myJson[28][k] + myJson[30][k]) / 2;
          myJson[58][k] = (myJson[57][k] + myJson[59][k]) / 2;
        });

        for (let i = 0; i < myJson.length; i++) {
          this.birdJson.push(myJson[i]);
          if (myJson[i + 1]) {
            let tmp = [];
            myJson[i].forEach((v, k) => {
              tmp.push((v + myJson[i + 1][k]) / 2);
            });
            this.birdJson.push(tmp);
          }
        }
      });
  }

  toBird() {
    story2 = 1;

    // bird scaling
    var ani1 = new BABYLON.Animation(
      "toBirdAni",
      "scaling",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani1.setKeys([
      {
        frame: 0,
        value: this.bird.scaling
      },
      {
        frame: stf(1.5),
        value: new BABYLON.Vector3(0.01, 0.01, 0.01)
      }
    ]);

    // bird position
    var ani2 = new BABYLON.Animation(
      "toBirdAni",
      "position.z",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani2.setKeys([
      {
        frame: 0,
        value: this.bird.position.z
      },
      {
        frame: stf(1.5),
        value: birdConfig.z
      }
    ]);

    // camera beta
    var ani3 = new BABYLON.Animation(
      "ani3",
      "beta",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani3.setKeys([
      {
        frame: 0,
        value: camera2.beta
      },
      {
        frame: stf(1.5),
        value: km.radians(104)
      }
    ]);

    var ani4 = new BABYLON.Animation(
      "ani4",
      "target",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani4.setKeys([
      {
        frame: 0,
        value: camera2.target
      },
      {
        frame: stf(1.5),
        value: new BABYLON.Vector3(camera2.alpha, birdConfig.y, birdConfig.z)
      }
    ]);

    scene2.beginDirectAnimation(
      this.bird,
      [ani1, ani2],
      0,
      stf(1.5),
      false,
      1,
      () => {
        return false;
        for (let i = 0; i < this.birdJson.length; i++) {
          setTimeout(() => {
            this.bird.disableEdgesRendering();
            this.bird.setVerticesData(
              BABYLON.VertexBuffer.PositionKind,
              this.birdJson[i],
              true
            );
            this.bird.createNormals();
            this.bird.enableEdgesRendering();
            if (i === this.birdJson.length - 1) {
              story2 = 2;
            }
            // }, i * 50);
          }, i * 16.67);
        }
      }
    );

    scene2.beginDirectAnimation(
      camera2,
      [ani3, ani4],
      0,
      stf(1.5),
      false,
      1,
      () => {}
    );
  }

  toScreen() {
    story2 = 3;

    for (
      let i = 0, j = this.birdJson.length - 1;
      i < this.birdJson.length;
      i++, j--
    ) {
      setTimeout(() => {
        this.bird.disableEdgesRendering();
        this.bird.setVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          this.birdJson[j],
          true
        );
        this.bird.createNormals();
        this.bird.enableEdgesRendering();

        if (j === 0) {
          let z =
            (camera2.position.length() * Math.tan(camera2.fov / 2)) /
            this.birdSize.z;
          let x = z * engine.getAspectRatio(camera2);
          var ani1 = new BABYLON.Animation(
            "toScreenAni",
            "scaling",
            fr,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );
          ani1.setKeys([
            {
              frame: 0,
              value: this.bird.scaling
            },
            {
              frame: stf(1),
              value: new BABYLON.Vector3(x, 1, z)
            }
          ]);

          var ani2 = new BABYLON.Animation(
            "ani2",
            "alpha",
            fr,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );
          ani2.setKeys([
            {
              frame: 0,
              value: camera2.alpha
            },
            {
              frame: stf(1),
              value: -Math.PI / 2
            }
          ]);

          var ani3 = new BABYLON.Animation(
            "ani3",
            "beta",
            fr,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );
          ani3.setKeys([
            {
              frame: 0,
              value: camera2.beta
            },
            {
              frame: stf(1),
              value: 0
            }
          ]);

          scene2.beginDirectAnimation(
            this.bird,
            [ani1],
            0,
            stf(1),
            false,
            1,
            () => {
              story2 = 0;
            }
          );

          scene2.beginDirectAnimation(
            camera2,
            [ani2, ani3],
            0,
            stf(1),
            false,
            1,
            () => {
              // story2 = 0;
            }
          );
        }
      }, i * 16.67);
    }
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

  flap() {
    this.deltaFlap += 0.5;
    let frame = parseInt(km.map(Math.cos(this.deltaFlap), -1, 1, 120, 200));
    // console.log(frame)

    this.bird.disableEdgesRendering();
    this.bird.setVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      this.birdJson[frame],
      true
    );
    this.bird.createNormals();
    this.bird.enableEdgesRendering();
  }

  fly() {
    this.bird.position.x = 20 * Math.sin(this.deltaFly);
    this.bird.position.z = 20 * Math.cos(this.deltaFly);
    this.deltaFly += 0.03;
    this.bird.rotation.y = -Math.atan2(
      this.bird.position.z,
      this.bird.position.x
    );
  }

  updateRatio() {
    if (!this.birdSize) return false;
    if (story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) / this.birdSize.z;
    let x = z * engine.getAspectRatio(camera2);
    // console.log(x,z);
    this.bird.scaling.x = x;
    this.bird.scaling.z = z;
  }

  render() {
    // if (story2 === 2 || story2 === 3) {
    //   this.dome.rotation.y -= 0.003;
    // }
    if (story2 === 2) {
      // this.flap();
      // this.fly();
    }
    scene2.render();
  }
}
