import { stf, htc, hslToRgb } from "./util.js";

export default class Space {
  constructor(options) {
    Object.assign(this, options);

    this.mats = [];
    this.init();
    this.animate();
  }

  init() {
    this.sps = new BABYLON.SolidParticleSystem("this.sps", scene1, {
      enableMultiMaterial: true,
      updatable: false,
    });

    this.sps.billboard = true;
    this.sps.computeParticleRotation = false;
    this.sps.computeParticleColor = false;
    this.sps.computeParticleTexture = false;
    this.sps.computeParticleVertex = false;

    var sphere = BABYLON.MeshBuilder.CreateSphere(
      "s",
      {
        segments: 2,
        diameter: this.bulbSize,
      },
      scene1
    );

    // multi materials - from brightest to dark
    for (let i = 1; i <= this.matStep; i++) {
      let mat = new BABYLON.StandardMaterial("mat" + i, scene1);
      mat.disableLighting = true;
      mat.backFaceCulling = false;

      mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
      let light = km.map(
        1 - Math.sin(((i / this.matStep) * Math.PI) / 2),
        0,
        1,
        0.3,
        0.6
      );

      let rgb = hslToRgb(km.map(i, 1, this.matStep, 0.7, 1), 0.5, light);
      mat.emissiveColorTarget = new BABYLON.Color3(rgb.r, rgb.g, rgb.b);

      this.mats.push(mat);
    }

    this.sps.addShape(sphere, this.num, {
      positionFunction: (particle, i, s) => {
        let a = i * km.radians(this.angle);
        let r = this.gap * Math.sqrt(i);
        let x = r * Math.cos(a);
        let z = r * Math.sin(a);
        let y = (((i / this.num) * i) / this.num) * this.height + this.y;

        particle.position.x = x;
        particle.position.y = y;
        particle.position.z = z;
        particle.materialIndex = Math.floor(
          km.map(i, 0, this.num, 0, this.matStep)
        );
      },
    });

    sphere.dispose();
    let mesh = this.sps.buildMesh();
    this.sps.setMultiMaterial(this.mats);
    this.sps.computeSubMeshes();

    // rtt
    renderTarget.renderList.push(this.sps.mesh);
  }

  animate() {
    this.mats.forEach((v, k) => {
      let ani = new BABYLON.Animation(
        "on" + k,
        "emissiveColor",
        fr,
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let keys = [
        {
          frame: 0,
          value: v.emissiveColor,
        },
        {
          frame: stf(k * this.bulbDelay + this.delay),
          value: v.emissiveColor,
        },
        {
          frame: stf(k * this.bulbDelay + this.bulbDuration + this.delay),
          value: v.emissiveColorTarget,
        },
      ];

      ani.setKeys(keys);

      v.animations = [ani];

      scene1.beginAnimation(
        v,
        0,
        stf(k * this.bulbDelay + this.bulbDuration + this.delay),
        false
      );
    });
  }
}
