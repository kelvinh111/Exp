/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Paper {
  constructor(options) {
    Object.assign(this, options);

    this.ori = "yeah";

    this.init();
  }

  init() {
    this.rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    this.rttMaterial.emissiveTexture = renderTarget;
    this.rttMaterial.disableLighting = true;
    this.rttMaterial.backFaceCulling = false;

    this.paperJson = [];
    BABYLON.SceneLoader.ImportMesh(
      "",
      `https://public.kelvinh.studio/cdn/3d/${this.ori}/`,
      `${this.ori} _ 0PercentFolded.obj`,
      scene2,
      (s) => {
        this.paper = s[0];
        this.paperSize = this.paper.getBoundingInfo().boundingBox.extendSize;
        this.updateRatio();
        this.paper.material = this.rttMaterial;
        this.paper.enableEdgesRendering();
        this.paper.edgesWidth = 2.0;
        this.paper.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        var pos = this.paper.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.paper.setVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          pos,
          true
        );
      }
    );

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
          this.paperJson.push(myJson[i]);
          // added extra frames to make the animation smoother
          if (myJson[i + 1]) {
            let tmp = [];
            myJson[i].forEach((v, k) => {
              tmp.push((v + myJson[i + 1][k]) / 2);
            });
            this.paperJson.push(tmp);
          }
        }
      });
  }

  toPaper() {
    let aniStartPaperScale = () => {
      var deferred = Q.defer();
      var ani = new BABYLON.Animation(
        "aniStartPaperScale",
        "scaling",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let sx = this.paper.scaling.x * paperConfig.aniStart.scaling;
      ani.setKeys([
        {
          frame: 0,
          value: this.paper.scaling
        },
        {
          frame: stf(paperConfig.aniStart.scalingDur),
          value: new BABYLON.Vector3(sx, sx, sx)
        }
      ]);

      scene2.beginDirectAnimation(
        this.paper,
        [ani],
        0,
        stf(paperConfig.aniStart.scalingDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );
      return deferred.promise;
    };
    let aniStartPaperOri = () => {
      var deferred = Q.defer();

      for (let i = 0; i < this.paperJson.length; i++) {
        setTimeout(() => {
          this.paper.disableEdgesRendering();
          this.paper.setVerticesData(
            BABYLON.VertexBuffer.PositionKind,
            this.paperJson[i],
            true
          );
          this.paper.createNormals();
          this.paper.enableEdgesRendering();
          if (i === this.paperJson.length - 1) {
            deferred.resolve();
          }
        }, i * 16.67);
        // }, i * 12);
      }

      return deferred.promise;
    };

    let aniStartPaperDrop = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniStartPaperDrop",
        "position",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: this.paper.position
        },
        {
          frame: stf(0.2),
          value: new BABYLON.Vector3(0, -19.1, 0)
        },
        {
          frame: stf(0.3),
          value: new BABYLON.Vector3(0.6, -18, 0)
        },
        {
          frame: stf(0.49),
          value: new BABYLON.Vector3(0.9, -19.1, 0)
        },
        {
          frame: stf(0.53),
          value: new BABYLON.Vector3(0.6, -19.2, 0.7)
        },
        {
          frame: stf(0.6),
          value: new BABYLON.Vector3(0.6, -19.2, 0.7)
        }
      ]);

      var ani2 = new BABYLON.Animation(
        "aniStartPaperDrop",
        "rotation",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani2.setKeys([
        {
          frame: 0,
          value: this.paper.rotation
        },
        {
          frame: stf(0.2),
          value: this.paper.rotation
        },
        {
          frame: stf(0.3),
          value: new BABYLON.Vector3(0, 0, km.radians(-60))
        },
        {
          frame: stf(0.51),
          value: new BABYLON.Vector3(
            km.radians(7),
            km.radians(8),
            km.radians(-30)
          )
        },
        {
          frame: stf(0.6),
          value: new BABYLON.Vector3(km.radians(17), km.radians(17), 0)
        }
      ]);

      scene2.beginDirectAnimation(
        this.paper,
        [ani, ani2],
        0,
        stf(0.6),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );
      return deferred.promise;
    };

    g.story2 = 1;
    aniStartPaperScale()
      .then(() => {
        return aniStartPaperOri();
      })
      .then(() => {
        return aniStartPaperDrop();
      })
      // .then(() => {
      //   g.story2 = 2;
      // })
      .catch(function (error) {
        // Handle any error from all above steps
        console.error(error);
      })
      .done(() => {});
  }

  toScreen() {
    let aniEndPaperOri = () => {
      var deferred = Q.defer();

      for (
        let i = 0, j = this.paperJson.length - 1;
        i < this.paperJson.length && j >= 0;
        i++, j -= 2
      ) {
        setTimeout(() => {
          this.paper.disableEdgesRendering();
          this.paper.setVerticesData(
            BABYLON.VertexBuffer.PositionKind,
            this.paperJson[j],
            true
          );
          this.paper.createNormals();
          this.paper.enableEdgesRendering();
          if (j === 0) {
            deferred.resolve();
          }
        }, i * 16.67);
      }
      return deferred.promise;
    };

    // g.story2 = 4;
    Q.all([aniEndPaperOri()]).done(() => {
      g.story2 = 0;
    });
  }

  updateRatio() {
    if (!this.paperSize) return false;
    if (g.story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) /
      this.paperSize.z;
    let x = z * engine.getAspectRatio(camera2);
    // console.log(x,z);
    this.paper.scaling.x = x;
    this.paper.scaling.z = z;
  }
}
