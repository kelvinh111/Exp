/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);

    this.ori = "bird4";
    this.deltaFlap = 0;
    this.deltaFly = 0;
    // this.deltaFly = Math.PI * 2;

    this.alpha = -Math.PI / 2;
    this.beta = 0;
    this.radius = 7;
    this.target = new BABYLON.Vector3(0, 0, 0);

    this.init();
    // this.makeJson();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    scene2.clearColor = htc("dddddd");
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      0,
      7,
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

    this.dome = new BABYLON.PhotoDome(
      "testdome",
      "https://public.kelvinh.studio/cdn/images/sky6.png",
      {
        resolution: 32,
        size: 1000
      },
      scene2
    );
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
        this.cage = s[0];
        this.cage.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        this.cage.position.y = -30;
        this.cage.setEnabled(false);
      }
    );

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
    story2 = 1;

    let aniStartBirdScale = () => {
      var deferred = Q.defer();
      var ani = new BABYLON.Animation(
        "toBirdAni",
        "scaling",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let sx = this.bird.scaling.x * 0.4;
      ani.setKeys([
        {
          frame: 0,
          value: this.bird.scaling
        },
        {
          frame: stf(1),
          value: new BABYLON.Vector3(sx, sx, sx)
        }
      ]);

      scene2.beginDirectAnimation(this.bird, [ani], 0, stf(1), false, 1, () => {
        deferred.resolve();
      });
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
          value: _.clone(camera2.beta)
        },
        {
          frame: stf(3),
          value: km.radians(135)
        }
      ]);
      scene2.beginDirectAnimation(camera2, [ani], 0, stf(3), false, 1, () => {
        deferred.resolve();
      });

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
            story2 = 2;

            deferred.resolve();
          }
        }, i * 16.67);
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
          frame: stf(1),
          value: new BABYLON.Vector3(-100, 0, -100)
        }
      ]);
      scene2.beginDirectAnimation(
        this.bird,
        [ani4],
        0,
        stf(1),
        false,
        1,
        () => {
          this.cage.setEnabled(true);
          this.bird.scaling = new BABYLON.Vector3(
            birdConfig.scaling,
            birdConfig.scaling,
            birdConfig.scaling
          );
          story2 = 3;
          // this.fly();

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
          value: _.clone(camera2.radius)
        },
        {
          frame: stf(1),
          value: 65
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
          value: _.clone(camera2.target.y)
        },
        {
          frame: stf(1),
          value: -8
        }
      ]);
      scene2.beginDirectAnimation(
        camera2,
        [ani5, ani6],
        0,
        stf(1),
        false,
        1,
        () => {
          deferred.resolve();
        }
      );

      return deferred.promise;
    };

    aniStartBirdScale()
      .then(() => {
        return Q.all([aniStartCamBeta(), aniStartBirdOri()]);
      })
      // .delay(1000)
      .then(() => {
        return aniStartBirdPos();
      })
      .then(() => {
        return aniStartCamMove();
      })
      .catch(function (error) {
        // Handle any error from all above steps
        console.error(error);
      })
      .done();
  }

  aniEndBirdOri() {
    var deferred = Q.defer();

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
          deferred.resolve();
        }
      }, i * 16.67);
    }
    return deferred.promise;
  }

  aniEndCamMove() {
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
        value: _.clone(camera2.beta)
      },
      {
        frame: stf(1),
        value: 0
      }
    ]);

    var ani2 = new BABYLON.Animation(
      "ani2",
      "radius",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani2.setKeys([
      {
        frame: 0,
        value: _.clone(camera2.radius)
      },
      {
        frame: stf(1),
        value: 15
      }
    ]);

    var ani3 = new BABYLON.Animation(
      "ani3",
      "target.y",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    ani3.setKeys([
      {
        frame: 0,
        value: camera2.target.y
      },
      {
        frame: stf(1),
        value: 0
      }
    ]);

    scene2.beginDirectAnimation(
      camera2,
      [ani1, ani2, ani3],
      0,
      stf(1),
      false,
      1,
      () => {
        deferred.resolve();
      }
    );

    return deferred.promise;
  }

  aniEndBirdPos() {
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
        frame: stf(1),
        value: new BABYLON.Vector3(0, 0, 0)
      }
    ]);

    scene2.beginDirectAnimation(this.bird, [ani1], 0, stf(1), false, 1, () => {
      deferred.resolve();
    });

    return deferred.promise;
  }

  aniEndBirdScale() {
    var deferred = Q.defer();

    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) / this.birdSize.z;
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
        frame: stf(1),
        value: 0
      }
    ]);

    scene2.beginDirectAnimation(
      this.bird,
      [ani1, ani2],
      0,
      stf(1),
      false,
      1,
      () => {
        deferred.resolve();
      }
    );

    return deferred.promise;
  }

  toScreen() {
    story2 = 4;
    Q.all([this.aniEndBirdPos(), this.aniEndCamMove()])
      .then(() => {
        return this.aniEndBirdOri();
      })
      .then(() => {
        return this.aniEndBirdScale();
      })
      .done(() => {
        story2 = 0;
      });
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
    this.deltaFlap += birdConfig.flapSpeed;
    let frame = parseInt(km.map(Math.cos(this.deltaFlap), -1, 1, 120, 200));
    // console.log(frame)
    ``;
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
    if (story2 !== 0) return false;
    let z =
      (camera2.position.length() * Math.tan(camera2.fov / 2)) / this.birdSize.z;
    let x = z * engine.getAspectRatio(camera2);
    // console.log(x,z);
    this.bird.scaling.x = x;
    this.bird.scaling.z = z;
  }

  render() {
    if (story2 === 2) {
      this.flap();
    }
    if (story2 === 3) {
      this.flap();
      this.fly();
    }
    scene2.render();
  }
}
