import * as workerTimers from "worker-timers";
import { stf, hexToColor } from "./util.js";

export default class Stage {
  constructor(options) {
    Object.assign(this, options);

    this.macbookNodes = [];
    this.mbT = null;
    this.mbT1Id = null;
    this.mbT2Id = mbScreen.uniqueId;
    this.mbTimeline = gsap.timeline({ repeat: -1 });
    this.mbTimeline.pause();
    this.initMacbook();
  }

  initMacbook() {
    let re = (t) => {
      if (t._children) {
        t._children.forEach((v) => {
          re(v);
        });
      } else {
        // s1gl.addExcludedMesh(t);
        this.macbookNodes.push(t);
        if (t.id === "display.001_dispaly_0") {
          this.mbT = t;
          this.mbT1Id = t.material.albedoTexture.uniqueId;
        }
      }
    };

    mb.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
    mb.position.z = 0.5;
    mb.position.y = -5;
    mb._children[0]._children[0]._children[0]._children[0]._children[0]
      ._children[1]._children[2]._material._albedoTexture;
    re(mb);

    // disable loop & manually play it once
    this.mbAni = scene1.animationGroups[0];
    this.mbAni.loopAnimation = false;
    this.mbAni.pause();
    this.mbAni.goToFrame(3.75); // collapse the macbook
    this.initStage();
  }

  openMacbook() {
    this.mbAni.play();
  }

  macbookChangeScreen(active) {
    if (active) {
      this.mbT.material.albedoTexture = this.mbT.material.emissiveTexture = scene1.getTextureByUniqueID(
        this.mbT2Id
      );
    } else {
      this.mbT.material.albedoTexture = this.mbT.material.emissiveTexture = scene1.getTextureByUniqueID(
        this.mbT1Id
      );
    }
  }

  macbookFlash(active) {
    if (active) {
      this.mbTimeline.to(this.mbT.material.emissiveTexture, {
        level: 0.2,
        duration: 0.5,
      });
      this.mbTimeline.to(this.mbT.material.emissiveTexture, {
        level: 3,
        duration: 0.5,
      });
      this.mbTimeline.resume();
    } else {
      this.mbTimeline.pause(0, false);
    }
  }

  initStage() {
    var glass = BABYLON.MeshBuilder.CreateDisc(
      "glass",
      { radius: 7, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      scene1
    );

    glass.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    glass.position.y = -5;

    glass.computeWorldMatrix(true);
    var glass_worldMatrix = glass.getWorldMatrix();

    //Obtain normals for plane and assign one of them as the normal
    var glass_vertexData = glass.getVerticesData("normal");
    var glassNormal = new BABYLON.Vector3(
      glass_vertexData[0],
      glass_vertexData[1],
      glass_vertexData[2]
    );
    //Use worldMatrix to transform normal into its current value
    glassNormal = new BABYLON.Vector3.TransformNormal(
      glassNormal,
      glass_worldMatrix
    );

    //Create reflecting surface for mirror surface
    var reflector = new BABYLON.Plane.FromPositionAndNormal(
      glass.position,
      glassNormal.scale(-1)
    );

    //Create the mirror material
    var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene1);
    mirrorMaterial.diffuseColor = hexToColor("202020");
    mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture(
      "mirror",
      1024,
      scene1,
      true
    );
    mirrorMaterial.reflectionTexture.mirrorPlane = reflector;
    mirrorMaterial.reflectionTexture.renderList = [spsRing.mesh].concat(
      this.macbookNodes
    );
    mirrorMaterial.reflectionTexture.level = 1;
    mirrorMaterial.reflectionTexture.adaptiveBlurKernel = 8;

    glass.material = mirrorMaterial;

    var cone = BABYLON.MeshBuilder.CreateCylinder(
      "cone",
      { diameterTop: 14, diameterBottom: 0, height: 4, tessellation: 128 },
      scene1
    );
    cone.material = new BABYLON.StandardMaterial("cone", scene1);
    cone.material.diffuseColor = hexToColor("474b66");
    cone.position.y = -7.05;
    cone.freezeWorldMatrix();
    cone.freezeNormals();

    // rtt
    renderTarget.renderList = renderTarget.renderList.concat(this.macbookNodes);
    renderTarget.renderList.push(glass);
    renderTarget.renderList.push(cone);
  }
}
