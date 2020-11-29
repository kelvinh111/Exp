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
    this.paperSize = paperMesh.getBoundingInfo().boundingBox.extendSize;
    paperMesh.material = this.rttMaterial;
    paperMesh.enableEdgesRendering();
    paperMesh.edgesWidth = 2.0;
    paperMesh.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

    var pos = paperMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    paperMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);

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
    var outerDeferred = Q.defer();

    let aniStartPaperScale = () => {
      var deferred = Q.defer();
      var ani = new BABYLON.Animation(
        "aniStartPaperScale",
        "scaling",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let sx = paperMesh.scaling.x * paperConfig.aniStart.scaling;
      ani.setKeys([
        {
          frame: 0,
          value: paperMesh.scaling,
        },
        {
          frame: stf(paperConfig.aniStart.scalingDur),
          value: new BABYLON.Vector3(sx, sx, sx),
        },
      ]);

      scene2.beginDirectAnimation(
        paperMesh,
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
          paperMesh.disableEdgesRendering();
          paperMesh.setVerticesData(
            BABYLON.VertexBuffer.PositionKind,
            this.paperJson[i],
            true
          );
          paperMesh.createNormals();
          paperMesh.enableEdgesRendering();
          if (i === this.paperJson.length - 1) {
            deferred.resolve();
          }
        }, i * 16.67);
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
          value: paperMesh.position,
        },
        {
          frame: stf(0.2),
          value: new BABYLON.Vector3(0, -19.1, 0),
        },
        {
          frame: stf(0.3),
          value: new BABYLON.Vector3(0.6, -18.2, 0),
        },
        {
          frame: stf(0.49),
          value: new BABYLON.Vector3(0.9, -19.6, 0),
        },
        {
          frame: stf(0.53),
          value: new BABYLON.Vector3(0.7, -19.6, 0.4),
        },
        {
          frame: stf(0.6),
          value: new BABYLON.Vector3(0.7, -19.6, 0.4),
        },
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
          value: paperMesh.rotation,
        },
        {
          frame: stf(0.2),
          value: paperMesh.rotation,
        },
        {
          frame: stf(0.3),
          value: new BABYLON.Vector3(0, 0, km.radians(-60)),
        },
        {
          frame: stf(0.6),
          value: new BABYLON.Vector3(0, 0, km.radians(-60)),
        },
      ]);

      scene2.beginDirectAnimation(
        paperMesh,
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

    let aniStartCam = () => {
      var deferred = Q.defer();

      let opts = {
        beta: [camera2.beta, camera2.beta, 0.8, 1.2],
        radius: [camera2.radius, camera2.radius, 50, 70],
        dur: [0, stf(2.3), stf(6), stf(9)],
      };

      let anis = [];
      _.forEach(opts, (v, k) => {
        var ani = new BABYLON.Animation(
          "ani" + k,
          k,
          fr,
          k === "target"
            ? BABYLON.Animation.ANIMATIONTYPE_VECTOR3
            : BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        let keys = [];
        v.forEach((v2, k2) => {
          keys.push({
            frame: opts.dur[k2],
            value: v2,
          });
        });
        ani.setKeys(keys);
        let ease = new BABYLON.SineEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        ani.setEasingFunction(ease);
        anis.push(ani);
      });

      scene2.beginDirectAnimation(
        camera2,
        anis,
        0,
        opts.dur[opts.dur.length - 1],
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    let aniStartCam2 = () => {
      var deferred = Q.defer();

      let optsCam = {
        "target.x": [camera2.target.x, -21.3],
        "target.y": [camera2.target.y, -25.5],
        "target.z": [camera2.target.z, -7],
        dur: [0, stf(4)],
      };
      let anisCam = [];
      _.forEach(optsCam, (v, k) => {
        var ani = new BABYLON.Animation(
          "ani" + k,
          k,
          fr,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT
        );
        let keys = [];
        v.forEach((v2, k2) => {
          keys.push({
            frame: optsCam.dur[k2],
            value: v2,
          });
        });
        ani.setKeys(keys);
        let ease = new BABYLON.SineEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        ani.setEasingFunction(ease);
        anisCam.push(ani);
      });
      setTimeout(() => {
        scene2.beginDirectAnimation(
          camera2,
          anisCam,
          0,
          optsCam.dur[optsCam.dur.length - 1],
          false,
          1,
          () => {
            deferred.resolve();
          }
        );
      }, 6000);
      return deferred.promise;
    };

    let aniStartLight = () => {
      var deferred = Q.defer();
      var ani = new BABYLON.Animation(
        "aniLight",
        "direction",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: s2light.direction,
        },
        {
          frame: stf(3),
          value: new BABYLON.Vector3(-0.8, -0.4, -1),
        },
      ]);
      let ease = new BABYLON.SineEase();
      ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      var ani2 = new BABYLON.Animation(
        "aniFlower",
        "scaling",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani2.setKeys([
        {
          frame: 0,
          value: flower.scaling,
        },
        {
          frame: stf(3),
          value: new BABYLON.Vector3(20, 20, 20),
        },
      ]);

      ani.setEasingFunction(ease);
      ani2.setEasingFunction(ease);

      setTimeout(() => {
        scene2.beginDirectAnimation(
          s2light,
          [ani],
          0,
          stf(3),
          false,
          1,
          () => {}
        );

        scene2.beginDirectAnimation(flower, [ani2], 0, stf(3), false, 1, () => {
          deferred.resolve();
        });
      }, 9000);

      return deferred.promise;
    };

    aniStartCam();
    aniStartCam2();
    aniStartLight().done(() => {
      // g.story2 = 2;
      outerDeferred.resolve();
    });

    aniStartPaperScale()
      .then(() => {
        return aniStartPaperOri();
      })
      .then(() => {
        return aniStartPaperDrop();
      });

    return outerDeferred.promise;
  }

  toScreen() {
    var outerDeferred = Q.defer();

    let aniEndCam = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "target.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: camera2.target.y,
        },
        {
          frame: stf(3),
          value: 60,
        },
      ]);

      scene2.beginDirectAnimation(camera2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    let aniEndCam2 = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "beta",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: camera2.beta,
        },
        {
          frame: stf(3),
          value: 2.3,
        },
      ]);

      scene2.beginDirectAnimation(camera2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    let aniEndFog = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "fogColor",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: scene2.fogColor,
        },
        {
          frame: stf(3),
          value: htc("000000"),
        },
      ]);

      scene2.beginDirectAnimation(scene2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    Q.all([aniEndCam(), aniEndCam2(), aniEndFog()]).done(() => {
      outerDeferred.resolve();
    });

    return outerDeferred.promise;
  }

  toPaperb() {
    var outerDeferred = Q.defer();

    let aniEndCam = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "target.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: 60,
        },
        {
          frame: stf(3),
          value: -25.5,
        },
      ]);

      scene2.beginDirectAnimation(camera2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    let aniEndCam2 = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "beta",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: camera2.beta,
        },
        {
          frame: stf(3),
          value: 1.2,
        },
      ]);

      scene2.beginDirectAnimation(camera2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    let aniEndFog = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "aniEnd",
        "fogColor",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: scene2.fogColor,
        },
        {
          frame: stf(3),
          value: htc("5F779E"),
        },
      ]);

      scene2.beginDirectAnimation(scene2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

      return deferred.promise;
    };

    Q.all([aniEndCam(), aniEndCam2(), aniEndFog()]).done(() => {
      outerDeferred.resolve();
    });

    return outerDeferred.promise;
  }

  updateRatio() {
    if (!this.paperSize) return false;
    if (g.scene !== 2 || g.story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) /
      this.paperSize.z;
    let x = z * engine.getAspectRatio(camera2);
    paperMesh.scaling.x = x;
    paperMesh.scaling.z = z;
  }
}
