/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Bird {
  constructor(options) {
    Object.assign(this, options);

    this.ori = "yeah";
    this.deltaFlap = 0;
    this.deltaFly = 0;

    this.init();
  }

  init() {
    this.rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    this.rttMaterial.emissiveTexture = renderTarget;
    this.rttMaterial.disableLighting = true;
    this.rttMaterial.backFaceCulling = false;

    this.birdJson = [];
    BABYLON.SceneLoader.ImportMesh(
      "",
      `https://public.kelvinh.studio/cdn/3d/${this.ori}/`,
      `${this.ori} _ 0PercentFolded.obj`,
      scene2,
      (s) => {
        // console.log(s[0])
        this.bird = s[0];
        this.birdSize = this.bird.getBoundingInfo().boundingBox.extendSize;
        this.updateRatio();
        // console.log(this.birdSize);
        this.bird.material = this.rttMaterial;
        this.bird.enableEdgesRendering();
        this.bird.edgesWidth = 2.0;
        this.bird.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        var pos = this.bird.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this.bird.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);
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
    let aniStartBirdScale = () => {
      var deferred = Q.defer();
      var ani = new BABYLON.Animation(
        "toBirdAni",
        "scaling",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let sx = this.bird.scaling.x * birdConfig.aniStart.scaling;
      ani.setKeys([
        {
          frame: 0,
          value: this.bird.scaling
        },
        {
          frame: stf(birdConfig.aniStart.scalingDur),
          value: new BABYLON.Vector3(sx, sx, sx)
        }
      ]);

      scene2.beginDirectAnimation(
        this.bird,
        [ani],
        0,
        stf(birdConfig.aniStart.scalingDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );
      return deferred.promise;
    };

    let aniStartCamBeta = () => {
      var deferred = Q.defer();

      var ani = new BABYLON.Animation(
        "ani2",
        "beta",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani.setKeys([
        {
          frame: 0,
          value: camera2.beta
        },
        {
          frame: stf(birdConfig.aniStart.camBetaDur),
          value: birdConfig.aniStart.camBeta
        }
      ]);
      scene2.beginDirectAnimation(
        camera2,
        [ani],
        0,
        stf(birdConfig.aniStart.camBetaDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    let aniStartBirdOri = () => {
      var deferred = Q.defer();

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
            deferred.resolve();
          }
          // }, i * 16.67);
        }, i * 10);
      }

      return deferred.promise;
    };

    let aniStartBirdPos = () => {
      var deferred = Q.defer();

      var ani4 = new BABYLON.Animation(
        "ani4",
        "position",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani4.setKeys([
        {
          frame: 0,
          value: this.bird.position
        },
        {
          frame: stf(birdConfig.aniStart.posDur),
          value: birdConfig.aniStart.pos
        }
      ]);
      scene2.beginDirectAnimation(
        this.bird,
        [ani4],
        0,
        stf(birdConfig.aniStart.posDur),
        false,
        1,
        () => {
          // cage.setEnabled(true);
          this.bird.scaling = new BABYLON.Vector3(
            birdConfig.scaling,
            birdConfig.scaling,
            birdConfig.scaling
          );

          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    let aniStartCamMove = () => {
      var deferred = Q.defer();

      var ani5 = new BABYLON.Animation(
        "ani2",
        "radius",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani5.setKeys([
        {
          frame: 0,
          value: camera2.radius
        },
        {
          frame: stf(birdConfig.aniStart.camMoveDur),
          value: birdConfig.aniStart.camMoveRadius
        }
      ]);

      var ani6 = new BABYLON.Animation(
        "ani2",
        "target.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani6.setKeys([
        {
          frame: 0,
          value: camera2.target.y
        },
        {
          frame: stf(birdConfig.aniStart.camMoveDur),
          value: birdConfig.aniStart.camMoveTargetY
        }
      ]);
      scene2.beginDirectAnimation(
        camera2,
        [ani5, ani6],
        0,
        stf(birdConfig.aniStart.camMoveDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    g.story2 = 1;
    aniStartBirdScale()
      .then(() => {
        return Q.all([aniStartCamBeta(), aniStartBirdOri()]);
      })
      .then(() => {
        g.story2 = 2;
      })
      // .delay(birdConfig.aniStart.posDelay)
      // .then(() => {
      //   return aniStartBirdPos();
      // })
      // .then(() => {
      //   g.story2 = 3;
      //   return aniStartCamMove();
      // })
      // .catch(function (error) {
      //   // Handle any error from all above steps
      //   console.error(error);
      // })
      .done(() => {});
  }

  toScreen() {
    let aniEndBirdOri = () => {
      var deferred = Q.defer();

      for (
        let i = 0, j = this.birdJson.length - 1;
        i < this.birdJson.length && j >= 0;
        i++, j -= 2
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
            deferred.resolve();
          }
        }, i * 16.67);
      }
      return deferred.promise;
    };

    let aniEndCamMove = () => {
      var deferred = Q.defer();

      var ani1 = new BABYLON.Animation(
        "ani1",
        "beta",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani1.setKeys([
        {
          frame: 0,
          value: camera2.beta
        },
        {
          frame: stf(birdConfig.aniEnd.camMoveDur),
          value: birdConfig.cam.beta
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
          frame: stf(birdConfig.aniEnd.camMoveDur),
          value: birdConfig.cam.alpha
        }
      ]);

      var ani3 = new BABYLON.Animation(
        "ani3",
        "radius",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani3.setKeys([
        {
          frame: 0,
          value: camera2.radius
        },
        {
          frame: stf(birdConfig.aniEnd.camMoveDur),
          value: birdConfig.aniEnd.camMoveRadius
        }
      ]);

      var ani4 = new BABYLON.Animation(
        "ani3",
        "target.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani4.setKeys([
        {
          frame: 0,
          value: camera2.target.y
        },
        {
          frame: stf(birdConfig.aniEnd.camMoveDur),
          value: birdConfig.aniEnd.camMoveTargetY
        }
      ]);

      scene2.beginDirectAnimation(
        camera2,
        [ani1, ani2, ani3, ani4],
        0,
        stf(birdConfig.aniEnd.camMoveDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    let aniEndBirdPos = () => {
      var deferred = Q.defer();

      var ani1 = new BABYLON.Animation(
        "yeah",
        "position",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani1.setKeys([
        {
          frame: 0,
          value: this.bird.position
        },
        {
          frame: stf(birdConfig.aniEnd.posDur),
          value: birdConfig.aniEnd.pos
        }
      ]);

      scene2.beginDirectAnimation(
        this.bird,
        [ani1],
        0,
        stf(birdConfig.aniEnd.posDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    let aniEndBirdScale = () => {
      var deferred = Q.defer();

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
          frame: stf(birdConfig.aniEnd.scalingDur),
          value: new BABYLON.Vector3(x, 1, z)
        }
      ]);

      var ani2 = new BABYLON.Animation(
        "toScreenAni",
        "rotation.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      ani2.setKeys([
        {
          frame: 0,
          value: this.bird.rotation.y
        },
        {
          frame: stf(birdConfig.aniEnd.scalingDur),
          value: 0
        }
      ]);

      scene2.beginDirectAnimation(
        this.bird,
        [ani1, ani2],
        0,
        stf(birdConfig.aniEnd.scalingDur),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    g.story2 = 4;
    Q.all([aniEndBirdPos(), aniEndCamMove()])
      .then(() => {
        return aniEndBirdOri();
      })
      .then(() => {
        return aniEndBirdScale();
      })
      .done(() => {
        g.story2 = 0;
      });
  }

  flap() {
    this.deltaFlap += birdConfig.flapSpeed;
    let frame = parseInt(km.map(Math.cos(this.deltaFlap), -1, 1, 120, 200));
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
    this.bird.position.x = birdConfig.flyRadius * Math.sin(this.deltaFly);
    this.bird.position.z = birdConfig.flyRadius * Math.cos(this.deltaFly);
    this.deltaFly += birdConfig.flySpeed;
    this.bird.rotation.y =
      Math.PI * 2 -
      (Math.atan2(this.bird.position.z, this.bird.position.x) + Math.PI / 4);
  }

  updateRatio() {
    if (!this.birdSize) return false;
    if (g.story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) / this.birdSize.z;
    let x = z * engine.getAspectRatio(camera2);
    // console.log(x,z);
    this.bird.scaling.x = x;
    this.bird.scaling.z = z;
  }
}
