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
      // if (t.name === "display.001") {
      //   console.log(Object.keys(t))
      // }
      if (t._children) {
        t._children.forEach((v) => {
          re(v);
        });
      } else {
        s1gl.addExcludedMesh(t);
        this.macbookNodes.push(t);
      }
    };

    // no autoplay
    BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (plugin) {
      if (plugin.name === "gltf") {
        // plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
      }
    });

    BABYLON.SceneLoader.AppendAsync(
      "https://public.kelvinh.studio/cdn/3d/macbook3/",
      "scene.gltf",
      scene
    ).then((s) => {
      s.rootNodes.forEach((v, k) => {
        if (v.id === "__root__") {
          // console.log(v)
          v.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
          v.position.y = -5.5;
          re(v);
        }
      });

      // disable loop & manually play it once
      // scene.animationGroups[0].children[0].animation.loopMode = 0;
      // console.log(scene.animationGroups[0])
      scene.animationGroups[0].loopAnimation = false;
      scene.animationGroups[0].pause();
      scene.animationGroups[0].goToFrame(3.75);
      // scene.animationGroups[0].play();
    });
  }

  initStage() {
    var glass = BABYLON.MeshBuilder.CreateDisc(
      "glass",
      { radius: 6, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      scene
    );

    glass.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    glass.position.y = -5.5;

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
      { diameterTop: 12, diameterBottom: 0, height: 4, tessellation: 128 },
      scene
    );
    cone.material = new BABYLON.StandardMaterial("cone", scene);
    //mirrorMaterial.specularColor = BABYLON.Color3.Yellow()
    cone.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    cone.position.y = -7.55;

    // rtt
    renderTarget.renderList = renderTarget.renderList.concat(this.macbookNodes);
    renderTarget.renderList.push(glass);
    renderTarget.renderList.push(cone);
  }
}
