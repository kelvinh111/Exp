/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Stage {
  constructor(options) {
    Object.assign(this, options);

    this.mats = [];
    this.init();
    this.animate();
  }

  init() {
    this.sps = new BABYLON.SolidParticleSystem("this.sps", scene, {
      enableMultiMaterial: true,
      updatable: false
    });

    this.sps.billboard = true;
    this.sps.computeParticleRotation = false;
    this.sps.computeParticleColor = false;
    this.sps.computeParticleTexture = false;
    this.sps.computeParticleVertex = false;

    var sphere = BABYLON.MeshBuilder.CreateSphere(
      "s",
      {
        segments: 3,
        diameter: this.bulbSize
      },
      scene
    );

    // multi materials - from brightest to dark
    for (let i = 1; i <= this.matStep; i++) {
      let mat = new BABYLON.StandardMaterial("mat" + i, scene);
      mat.disableLighting = true;
      mat.backFaceCulling = false;

      mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
      let co = km.map(
        1 - Math.sin(((i / this.matStep) * Math.PI) / 2),
        0,
        1,
        0.3,
        0.4
      );
      mat.emissiveColorTarget = new BABYLON.Color3(co, co, co);

      this.mats.push(mat);
    }

    this.sps.addShape(sphere, this.num, {
      positionFunction: (particle, i, s) => {
        let a = i * km.radians(this.angle);
        let r = this.gap * Math.sqrt(i);
        let x = r * Math.cos(a);
        let z = r * Math.sin(a);
        let y =
          (((((i / this.num) * i) / this.num) * i) / this.num) * this.height +
          this.y;

        particle.position.x = x;
        particle.position.y = y;
        particle.position.z = z;
        particle.materialIndex = Math.floor(
          km.map(i, 0, this.num, 0, this.matStep)
        );
      }
    });

    sphere.dispose();
    let mesh = this.sps.buildMesh();
    this.sps.setMultiMaterial(this.mats);
    this.sps.computeSubMeshes();
  }

  animate() {
    this.mats.forEach((v, k) => {
      let ani = new BABYLON.Animation(
        "on" + k,
        "emissiveColor",
        60,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let keys = [
        {
          frame: 0,
          value: v.emissiveColor
        },
        {
          frame: stf(k * 150),
          value: v.emissiveColor
        },
        {
          frame: stf(k * 150 + 1000),
          value: v.emissiveColorTarget
        }
      ];

      ani.setKeys(keys);

      v.animations = [ani];

      scene.beginAnimation(v, 0, stf(k * 500 + 2000), false, 1, () => {});
    });
  }
}
