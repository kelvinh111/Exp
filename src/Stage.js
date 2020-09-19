/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Stage {
  constructor(options) {
    Object.assign(this, options);

    this.macbookNodes = [];
    this.initMacbook();
  }

  initMacbook() {
    let re = (t) => {
      if (t._children) {
        t._children.forEach((v) => {
          re(v);
        });
      } else {
        this.macbookNodes.push(t);
      }
    };

    BABYLON.SceneLoader.AppendAsync(
      "https://public.kelvinh.studio/cdn/3d/macbook/",
      "scene.gltf",
      scene
    ).then((s) => {
      s.rootNodes.forEach((v, k) => {
        if (v.id === "__root__") {
          v.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
          v.position.y = -50;
          re(v);
        }
      });

      this.initStage();
    });
  }

  initStage() {
    var glass = BABYLON.MeshBuilder.CreateDisc(
      "cone",
      { radius: 150, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      scene
    );

    glass.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    glass.position.y = -50;

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
    var mirrorMaterial = new BABYLON.StandardMaterial("mirror", scene);
    //mirrorMaterial.specularColor = BABYLON.Color3.Yellow()
    mirrorMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture(
      "mirror",
      1024,
      scene,
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
      { diameterTop: 298, diameterBottom: 0, height: 100, tessellation: 128 },
      scene
    );
    cone.material = new BABYLON.StandardMaterial("cone", scene);
    //mirrorMaterial.specularColor = BABYLON.Color3.Yellow()
    cone.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    cone.position.y = -100.4;

    // rtt
    renderTarget.renderList = renderTarget.renderList.concat(this.macbookNodes);
    renderTarget.renderList.push(glass);
    renderTarget.renderList.push(cone);
  }
}
