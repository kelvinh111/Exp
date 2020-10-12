/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);
    this.plane = null;
    //this.camera = null;

    this.init();
    // this.makeJson();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      // Math.PI / 2,
      0,
      10,
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

    // let glow = new BABYLON.GlowLayer("glow", scene2, {
    //   //mainTextureFixedSize: 512,
    //   blurKernelSize: 16
    // });

    // this.plane = BABYLON.Mesh.CreatePlane("map", 1, scene2);
    // this.plane.enableEdgesRendering();
    // this.plane.edgesWidth = 1.0;
    // this.plane.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
    // this.plane.setEnabled(false);
    // this.plane.isVisible = false;

    // create a material for the RTT and apply it to the plane
    this.rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    this.rttMaterial.emissiveTexture = renderTarget;
    this.rttMaterial.disableLighting = true;
    this.rttMaterial.backFaceCulling = false;
    // this.plane.material = this.rttMaterial;

    let name = "plane1";

    this.planeJson = [];
    BABYLON.SceneLoader.ImportMesh(
      "",
      `https://public.kelvinh.studio/cdn/3d/${name}/`,
      `${name} _ 0PercentFolded.obj`,
      scene2,
      (s) => {
        // console.log(s[0])
        this.plane = s[0];
        this.planeSize = this.plane.getBoundingInfo().boundingBox.extendSize;
        this.updateRatio();
        console.log(this.planeSize);
        // this.plane.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        this.plane.material = this.rttMaterial;
        this.plane.enableEdgesRendering();
        this.plane.edgesWidth = 2.0;
        this.plane.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        var pos = this.plane.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.plane.setVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          pos,
          true
        );

        fetch(`https://public.kelvinh.studio/cdn/3d/${name}/${name}.json`)
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
              this.planeJson.push(myJson[i]);
              if (myJson[i + 1]) {
                let tmp = [];
                myJson[i].forEach((v, k) => {
                  tmp.push((v + myJson[i + 1][k]) / 2);
                });
                this.planeJson.push(tmp);
              }
            }
          });
      }
    );
  }

  toPlane() {
    story2 = 1;
    var ani1 = new BABYLON.Animation(
      "toPlaneAni",
      "scaling",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    // console.log(this.plane.scaling)
    ani1.setKeys([
      {
        frame: 0,
        value: this.plane.scaling
      },
      {
        frame: stf(1),
        value: new BABYLON.Vector3(0.01, 0.01, 0.01)
      }
    ]);

    scene.beginDirectAnimation(this.plane, [ani1], 0, stf(1), false, 1, () => {
      for (let i = 0; i < this.planeJson.length; i++) {
        setTimeout(() => {
          // console.log(i)
          // return
          this.plane.disableEdgesRendering();
          this.plane.setVerticesData(
            BABYLON.VertexBuffer.PositionKind,
            this.planeJson[i],
            true
          );
          this.plane.createNormals();
          this.plane.enableEdgesRendering();
          if (i === this.planeJson.length - 1) {
            story2 = 2;
          }
          // }, i * 50);
        }, i * 16.67);
      }
    });
  }

  toScreen() {
    story2 = 3;

    for (
      let i = 0, j = this.planeJson.length - 1;
      i < this.planeJson.length;
      i++, j--
    ) {
      setTimeout(() => {
        // console.log(i,j);
        // return
        this.plane.disableEdgesRendering();
        this.plane.setVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          this.planeJson[j],
          true
        );
        this.plane.createNormals();
        this.plane.enableEdgesRendering();

        if (j === 0) {
          let z =
            (camera2.position.length() * Math.tan(camera2.fov / 2)) /
            this.planeSize.z;
          let x = z * engine.getAspectRatio(camera2);
          // this.plane.scaling.x = x;
          // this.plane.scaling.y = y;
          // console.log(z);
          var ani1 = new BABYLON.Animation(
            "toScreenAni",
            "scaling",
            fr,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );
          // console.log(this.plane.scaling)
          ani1.setKeys([
            {
              frame: 0,
              value: this.plane.scaling
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

          scene.beginDirectAnimation(
            this.plane,
            [ani1],
            0,
            stf(1),
            false,
            1,
            () => {
              story2 = 0;
            }
          );

          scene.beginDirectAnimation(
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
    let name = "plane1";
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
    // if (mb2) {
    //   mb2.rotation.y += 0.01;
    // console.log(mb2.rotation.y);
    // }
    scene2.render();
  }

  updateRatio() {
    if (!this.planeSize) return false;
    if (story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) /
      this.planeSize.z;
    let x = z * engine.getAspectRatio(camera2);
    // this.plane.scaling.x = x;
    // this.plane.scaling.y = y;
    // console.log(z);
    this.plane.scaling.x = x;
    this.plane.scaling.z = z;
  }
}
