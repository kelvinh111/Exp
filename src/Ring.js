import { stf, htc } from "./util.js";
import Bulb from "./Bulb";

export default class Ring {
  constructor(options = {}) {
    Object.assign(this, options);

    this.bulbs = [];
    this.dropConfig.done = false;
    this.circularConfig.on = false;
    this.initBulbs();
  }

  initBulbs() {
    for (let i = 1; i <= this.bulbNum; i++) {
      let x =
        Math.cos(
          ((i + this.circularConfig.rotateDelta) / this.bulbNum) * Math.PI * 2
        ) * this.radius;
      let z =
        Math.sin(
          ((i + this.circularConfig.rotateDelta) / this.bulbNum) * Math.PI * 2
        ) * this.radius;

      let bulb = new Bulb(this.bulbConfig);
      bulb.position = new BABYLON.Vector3(x, this.position.y, z);
      this.bulbs.push(bulb);
    }
  }

  aniDrop() {
    var deferred = Q.defer();

    this.bulbs.forEach((bulb, key) => {
      let aniDrop = new BABYLON.Animation(
        "drop" + key,
        "position.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let destY =
        this.dropConfig.position.y +
        this.circularConfig.height *
          Math.sin(
            km.map(
              (key + 1 + this.circularConfig.offsetDelta) % this.bulbNum,
              0,
              this.bulbNum,
              0,
              Math.PI * 2
            )
          );

      let keysDrop = [];
      if (this.dropConfig.dropFirst && key === 0) {
        keysDrop = [
          {
            frame: 0,
            value: bulb.core.position.y
          },
          {
            frame: stf(this.dropConfig.dropFirstDelay),
            value: bulb.core.position.y
          },
          {
            frame: stf(
              this.dropConfig.dropFirstDelay + this.dropConfig.dropFirstDuration
            ),
            value: destY
          }
        ];
      } else {
        keysDrop = [
          {
            frame: 0,
            value: bulb.core.position.y
          },
          {
            frame: stf(
              this.dropConfig.ringDelay + this.dropConfig.bulbDelay * key
            ),
            value: bulb.core.position.y
          },
          {
            frame: stf(
              this.dropConfig.ringDelay +
                this.dropConfig.bulbDelay * key +
                this.dropConfig.bulbDuration
            ),
            value: destY
          }
        ];
      }

      aniDrop.setKeys(keysDrop);

      bulb.core.animations = [aniDrop];

      scene.beginAnimation(
        bulb.core,
        0,
        stf(
          this.dropConfig.ringDelay +
            this.dropConfig.bulbDelay * key +
            this.dropConfig.bulbDuration
        ),
        false,
        1,
        () => {
          if (key + 1 === this.bulbNum) {
            //this.dropConfig.done = true;
            deferred.resolve();
          }
        }
      );
    });

    return deferred.promise;
  }

  aniOn() {
    var deferred = Q.defer();
    this.bulbs.forEach((bulb, key) => {
      let aniOn = new BABYLON.Animation(
        "on" + key,
        "emissiveColor",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let keysOn = [];
      if (this.dropConfig.dropFirst && key === 0) {
        keysOn = [
          // {
          //   frame: 0,
          //   value: ringsMats[bulb.core.materialIndex].emissiveColor
          // },
          // {
          //   frame: stf(this.dropConfig.dropFirstDelay),
          //   value: ringsMats[bulb.core.materialIndex].emissiveColor
          // },
          {
            frame: 0,
            value: this.dropConfig.color
          },
          {
            frame: stf(
              this.dropConfig.dropFirstDelay + this.dropConfig.dropFirstDuration
            ),
            value: this.dropConfig.color
          }
        ];
      } else {
        keysOn = [
          {
            frame: 0,
            value: ringsMats[bulb.core.materialIndex].emissiveColor
          },
          {
            frame: stf(
              this.dropConfig.ringDelay +
                this.dropConfig.bulbDelay * key +
                this.dropConfig.colorDelay
            ),
            value: ringsMats[bulb.core.materialIndex].emissiveColor
          },
          {
            frame: stf(
              this.dropConfig.ringDelay +
                this.dropConfig.bulbDelay * key +
                this.dropConfig.colorDelay +
                this.dropConfig.colorDuration
            ),
            value: this.dropConfig.color
          }
        ];
      }

      aniOn.setKeys(keysOn);

      ringsMats[bulb.core.materialIndex].animations = [aniOn];

      scene.beginAnimation(
        ringsMats[bulb.core.materialIndex],
        0,
        stf(
          this.dropConfig.ringDelay +
            this.dropConfig.bulbDelay * key +
            this.dropConfig.colorDelay +
            this.dropConfig.colorDuration
        ),
        false,
        1,
        () => {
          if (key + 1 === this.bulbNum) {
            //this.dropConfig.done = true;
            deferred.resolve();
          }
        }
      );
    });
    return deferred.promise;
  }

  toCircular() {
    var deferred = Q.defer();

    this.bulbs.forEach((bulb, key) => {
      let aniCircular = new BABYLON.Animation(
        "circular" + key,
        "position.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let destY =
        this.dropConfig.position.y +
        this.circularConfig.height *
          Math.sin(
            km.map(
              (key + 1 + this.circularConfig.offsetDelta) % this.bulbNum,
              0,
              this.bulbNum,
              0,
              Math.PI * 2
            )
          );

      let keysDrop = [
        {
          frame: 0,
          value: bulb.core.position.y
        },
        {
          frame: stf(3),
          value: destY
        }
      ];

      aniCircular.setKeys(keysDrop);

      bulb.core.animations = [aniCircular];

      scene.beginAnimation(bulb.core, 0, stf(3), false, 1, () => {
        if (key + 1 === this.bulbNum) {
          deferred.resolve();
        }
      });
    });
    return deferred.promise;
  }

  aniCircular() {
    this.bulbs.forEach((bulb, key) => {
      let destY =
        this.dropConfig.position.y +
        this.circularConfig.height *
          Math.sin(
            km.map(
              (key + 1 + this.circularConfig.offsetDelta) % this.bulbNum,
              0,
              this.bulbNum,
              0,
              Math.PI * 2
            )
          );
      bulb.core.position.y = destY;
    });
    this.circularConfig.offsetDelta += this.circularConfig.speed;
  }

  toWave() {
    var deferred = Q.defer();

    this.bulbs.forEach((bulb, key) => {
      let aniWave = new BABYLON.Animation(
        "circular" + key,
        "position.y",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let destY =
        this.dropConfig.position.y +
        this.waveConfig.height *
          Math.sin(
            km.map(
              (key + 1 + this.circularConfig.offsetDelta) % this.bulbNum,
              0,
              this.bulbNum / 4,
              0,
              Math.PI * 2
            )
          );

      let keysDrop = [
        {
          frame: 0,
          value: bulb.core.position.y
        },
        {
          frame: stf(3),
          value: destY
        }
      ];

      aniWave.setKeys(keysDrop);

      bulb.core.animations = [aniWave];

      scene.beginAnimation(bulb.core, 0, stf(3), false, 1, () => {
        if (key + 1 === this.bulbNum) {
          deferred.resolve();
        }
      });
    });
    return deferred.promise;
  }

  aniWave() {
    this.bulbs.forEach((bulb, key) => {
      let destY =
        this.dropConfig.position.y +
        this.waveConfig.height *
          Math.sin(
            km.map(
              (key + 1 + this.circularConfig.offsetDelta) % this.bulbNum,
              0,
              this.bulbNum / 4,
              0,
              Math.PI * 2
            )
          );
      bulb.core.position.y = destY;
    });
    this.circularConfig.offsetDelta += this.waveConfig.speed;
  }

  update() {
    if (g.story === 2) this.aniCircular();
    if (g.story === 4) this.aniWave();
  }
}
