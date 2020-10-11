/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
/* global kelvinUtil, BABYLON, Q, gb */
import { stf, htc } from "./util.js";

export default class Scene2 {
  constructor(options) {
    Object.assign(this, options);
    this.plane = null;
    //this.camera = null;

    this.init();
    this.updateRatio();
  }

  init() {
    scene2 = new BABYLON.Scene(engine);
    camera2 = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2,
      10,
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

    // let glow = new BABYLON.GlowLayer("glow", scene2, {
    //   //mainTextureFixedSize: 512,
    //   blurKernelSize: 16
    // });

    this.plane = BABYLON.Mesh.CreatePlane("map", 1, scene2);
    this.plane.enableEdgesRendering();
    this.plane.edgesWidth = 1.0;
    this.plane.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
    this.plane.setEnabled(false);

    // create a material for the RTT and apply it to the plane
    var rttMaterial = new BABYLON.StandardMaterial("RTT material", scene2);
    rttMaterial.emissiveTexture = renderTarget;
    rttMaterial.disableLighting = true;
    rttMaterial.backFaceCulling = false;

    this.plane.material = rttMaterial;
    this.plane.isVisible = false;

    // let re = (t) => {
    //   if (t.id === "Pillow_02") {
    //     t.dispose();
    //   }
    //   if (t._children) {
    //     t._children.forEach((v) => {
    //       re(v);
    //     });
    //   }
    // };

    // BABYLON.SceneLoader.ImportMesh(
    //   "",
    //   "https://public.kelvinh.studio/cdn/3d/bed/",
    //   "scene.gltf",
    //   scene2,
    //   (s) => {
    //     // console.log(s[0])
    //     re(s[0]);
    //   }
    // );

    // BABYLON.SceneLoader.ImportMesh(
    //   "",
    //   "https://public.kelvinh.studio/cdn/3d/macbook6/",
    //   "scene.gltf",
    //   scene2,
    //   (s) => {
    //     mb2 = s[0];
    //     mb2.scaling = new BABYLON.Vector3(0.0015, 0.0015, 0.0015);
    //     mb2.position.x = 0.436;
    //     mb2.position.y = -0.045;
    //     mb2.position.z = -0.226;
    //     mb2.rotation.y = Math.PI / 2;
    //     //  console.log(mb2)
    //     //"RootNode (gltf orientation matrix)"
    //     //"RootNode (model correction matrix)"
    //     //  mb2._children[0].rotation = Math.PI /2
    //     mb2.rotate(BABYLON.Axis.Y, km.radians(70), BABYLON.Space.WORLD);

    //     // mb.position.z = 0.5;
    //     // mb.position.y = -5;

    //     // disable loop & manually play it once
    //     // this.mbAni = scene.animationGroups[0];
    //     // this.mbAni.loopAnimation = false;
    //     // this.mbAni.pause();
    //     // this.mbAni.goToFrame(3.75); // collapse the macbook
    //   }
    // );

    // let yeah = [];
    // for (let i = 0; i <= 100; i++) {
    //   BABYLON.SceneLoader.ImportMesh(
    //     "",
    //     "https://public.kelvinh.studio/cdn/3d/randlettflappingbird/",
    //     "randlettflappingbird _ " + i + "PercentFolded.obj",
    //     scene2,
    //     (s) => {
    //       let b = s[0];
    //       var pos = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    //       yeah[i] = pos;
    //       console.log(i, JSON.stringify(yeah));
    //     }
    //   );
    // }
    // return;

    //https://public.kelvinh.studio/cdn/3d/randlettflappingbird/randlettflappingbird%20_%200PercentFolded.obj
    let name = "randlettflappingbird";
    BABYLON.SceneLoader.ImportMesh(
      "",
      `https://public.kelvinh.studio/cdn/3d/${name}/`,
      `${name} _ 0PercentFolded.obj`,
      scene2,
      (s) => {
        // console.log(s[0])
        let b = s[0];
        b.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        b.material = rttMaterial;
        b.enableEdgesRendering();
        b.edgesWidth = 2.0;
        b.edgesColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        var pos = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        b.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);

        fetch(
          `https://public.kelvinh.studio/cdn/3d/randlettflappingbird/${name}.json`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (myJson) {
            // fix incorrect frame
            myJson[28].forEach((v, k) => {
              myJson[29][k] = (myJson[28][k] + myJson[30][k]) / 2;
              myJson[58][k] = (myJson[57][k] + myJson[59][k]) / 2;
            });

            let j = [];
            for (let i = 0; i < myJson.length; i++) {
              j.push(myJson[i]);
              if (myJson[i + 1]) {
                let tmp = [];
                myJson[i].forEach((v, k) => {
                  tmp.push((v + myJson[i + 1][k]) / 2);
                });
                j.push(tmp);
              }
            }

            setTimeout(() => {
              for (let i = 0; i < j.length - 40; i++) {
                setTimeout(() => {
                  // console.log(k)
                  // return
                  b.disableEdgesRendering();
                  b.setVerticesData(
                    BABYLON.VertexBuffer.PositionKind,
                    j[i],
                    true
                  );
                  b.createNormals();
                  b.enableEdgesRendering();
                }, i * 16.67);
              }
            }, 3000);
          });

        // BABYLON.SceneLoader.ImportMesh(
        //   "",
        //   "https://public.kelvinh.studio/cdn/3d/",
        //   "randlettflappingbird _ 0PercentFolded.obj",
        //   scene2,
        //   (s) => {
        //     let b2 = s[0];

        //     var pos = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        //     b.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);

        //     var pos2 = b2.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        //     console.log(pos2)

        //     var positionFunction = function (positions) {
        //       var numberOfVertices = pos.length / 3; //Randomize the vertex coordinates in the array
        //       for (var i = 0; i < numberOfVertices; i++) {
        //         pos[i * 3] = pos2[i * 3];
        //         pos[i * 3 + 1] = pos2[i * 3 + 1];
        //         pos[i * 3 + 2] = pos2[i * 3 + 2];
        //       }
        //     };
        //     setTimeout(() => {
        //       b.disableEdgesRendering();
        //       b.updateMeshPositions(positionFunction, true);
        //       b.enableEdgesRendering();
        //     }, 3000);
        //   }
        // );
      }
    );
  }

  render() {
    // if (mb2) {
    //   mb2.rotation.y += 0.01;
    // console.log(mb2.rotation.y);
    // }
    scene2.render();
  }

  updateRatio() {
    let y = 2 * camera2.position.length() * Math.tan(camera2.fov / 2);
    let x = y * engine.getAspectRatio(camera2);
    this.plane.scaling.x = x;
    this.plane.scaling.y = y;
  }
}
