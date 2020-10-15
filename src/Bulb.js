/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */

export default class Bulb {
  constructor(options = {}) {
    Object.assign(this, options);

    this.idx = bulbCount;
    bulbCount++;

    this.core = null;
    this.lights = [];
    this.lightsPositions = [];

    this.initCore();
    this.initLightsPositions();
    this.initLights();
    this.rotate();
  }

  get position() {
    return this.core.position;
  }

  set position(position) {
    this.core.position = position;
  }

  get color() {
    return mats[this.core.materialIndex].emissiveColor;
  }

  set color(color) {
    mats[this.core.materialIndex].emissiveColor = color;
  }

  initCore() {
    this.core = spsRing.particles[particleCount++];

    this.core.position = this.position;

    this.core.scaling.x = this.coreSize;
    this.core.scaling.y = this.coreSize;
    this.core.scaling.z = this.coreSize;

    this.core.materialIndex = this.idx;
  }

  initLightsPositions() {
    let mesh = BABYLON.MeshBuilder.CreatePolyhedron(
      "oct",
      { type: 1, size: this.size },
      scene
    );
    mesh.position = this.position;
    let arr = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    // remove duplicated vertices
    let tmp = [];

    for (let i = 0; i < arr.length; i += 3) {
      tmp.push({
        x: arr[i],
        y: arr[i + 1],
        z: arr[i + 2]
      });
    }

    tmp = tmp.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) => t.x === thing.x && t.y === thing.y && t.z === thing.z
        )
    );

    this.lightsPositions = tmp;

    mesh.dispose();
  }

  initLights() {
    this.lightsPositions.forEach((v, k) => {
      let light = spsRing.particles[particleCount++];

      light.parentId = this.core.idx;

      light.position.x = v.x;
      light.position.y = v.y;
      light.position.z = v.z;

      light.scaling.x = this.lightSize;
      light.scaling.y = this.lightSize;
      light.scaling.z = this.lightSize;

      light.rotation.x = Math.random() * Math.PI;
      light.rotation.y = Math.random() * Math.PI;
      light.rotation.z = Math.random() * Math.PI;

      light.materialIndex = this.idx;

      this.lights.push(light);
    });
  }

  rotate() {
    let ani = new BABYLON.Animation(
      "bulbRotation",
      "rotation.y",
      fr,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    let anikeys = [];

    anikeys.push({
      frame: 0,
      value: 0
    });
    anikeys.push({
      frame: this.rotateDuration / 2,
      value: Math.PI
    });
    anikeys.push({
      frame: this.rotateDuration,
      value: Math.PI * 2
    });
    ani.setKeys(anikeys);

    scene.beginDirectAnimation(this.core, [ani], 0, this.rotateDuration, true);
  }
}
