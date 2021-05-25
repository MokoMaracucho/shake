import { Injectable, NgZone, ElementRef } from '@angular/core';
import { WindowRefService } from '../../shared/services/window-ref.service';

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import 'pepjs';

import { InteractionService } from './interaction.service';

@Injectable({
  providedIn: 'root'
})
export class Page001Service {

  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  private hdrTexture: BABYLON.CubeTexture;

  private camera: BABYLON.ArcRotateCamera;

  private directionalLight: BABYLON.DirectionalLight;

  private shadowGenerator: BABYLON.ShadowGenerator;

  private hemisphericLight: BABYLON.HemisphericLight;
  private spotLight_left: BABYLON.SpotLight;
  private spotLight_right: BABYLON.SpotLight;
  private spotLight_top: BABYLON.SpotLight;

  private axis_X;
  private axis_X_MATERIAL: BABYLON.StandardMaterial;
  private axis_Y;
  private axis_Y_MATERIAL: BABYLON.StandardMaterial;
  private axis_Z;
  private axis_Z_MATERIAL: BABYLON.StandardMaterial;

  private ground_PBR_MATERIAL: BABYLON.PBRMaterial;
  private ground;
  private bottle_PBR_MATERIAL: BABYLON.PBRMaterial;
  private bottle;
  private liquid_PBR_MATERIAL: BABYLON.StandardMaterial;
  private liquid;
  private tap;
  private etiquette;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    protected readonly interaction: InteractionService
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    // CANVAS - ENGINE - SCENE

    this.canvas = canvas.nativeElement;
    this.engine = new BABYLON.Engine(this.canvas, true);

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = BABYLON.Color4.FromHexString('#60d0e3FF');

    // HDR

    this.hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("../../assets/env/environment_005.env", this.scene);
    // this.hdrTexture.rotationY = Math.PI;
    this.scene.environmentTexture = this.hdrTexture;

    // CAMERA

    this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    this.camera.target = new BABYLON.Vector3(0, 3, 0);
    this.camera.fov = 0.5;
    this.camera.wheelDeltaPercentage = 0.001;
    this.camera.pinchDeltaPercentage = 0.01;
    this.camera.attachControl(canvas, true);

    // LIGHTS

    this.directionalLight = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0.3*4, -1*4, -0.3*4), this.scene);

    /* this.hemisphericLight = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hemisphericLight.intensity = 1; */

    this.spotLight_left = new BABYLON.SpotLight("spotLight_left", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, this.scene);
    this.spotLight_left.position = new BABYLON.Vector3(20, 10, 10);
    this.spotLight_left.setDirectionToTarget(new BABYLON.Vector3(0, 5, 0));
    this.spotLight_left.intensity = 100;

    this.spotLight_right = new BABYLON.SpotLight("spotLight_right", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, this.scene);
    this.spotLight_right.position = new BABYLON.Vector3(-20, 10, 10);
    this.spotLight_right.setDirectionToTarget(new BABYLON.Vector3(0, 5, 0));
    this.spotLight_right.intensity = 100;

    /* this.spotLight_top = new BABYLON.SpotLight("spotLight_top", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, this.scene);
    this.spotLight_top.position = new BABYLON.Vector3(0, 20, 0);
    this.spotLight_top.setDirectionToTarget(new BABYLON.Vector3(0, 0, 0));
    this.spotLight_top.intensity = 100; */

    // SHADOWS

    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.directionalLight);

    this.shadowGenerator.useBlurExponentialShadowMap = true;
    //this.hadowGenerator.useContactHardeningShadow = true;
    this.shadowGenerator.useKernelBlur = true;
    this.shadowGenerator.blurScale = 4;
    this.shadowGenerator.blurKernel = 64;
    this.shadowGenerator.depthScale = 0;
    this.shadowGenerator.contactHardeningLightSizeUVRatio = 0.5;

    // LIQUID

    /* this.liquid_PBR_MATERIAL = new BABYLON.PBRMaterial("liquid_PBR_MATERIAL", this.scene);
    this.bootle_PBR_MATERIAL.metallic = 0.0;
    this.bootle_PBR_MATERIAL.roughness = 0;
    this.bootle_PBR_MATERIAL.subSurface.isRefractionEnabled = true;

    this.liquid_PBR_MATERIAL.metallic = 0.5;
    this.liquid_PBR_MATERIAL.roughness = 0.5;
    this.liquid_PBR_MATERIAL.subSurface.isRefractionEnabled = true;
    this.liquid_PBR_MATERIAL.indexOfRefraction = 1.52;
    // this.liquid_PBR_MATERIAL.bottle_PBR_MATERIAL.alpha = 0.2;
    this.liquid_PBR_MATERIAL.directIntensity = 0.0;
    this.liquid_PBR_MATERIAL.environmentIntensity = 0.3;
    this.liquid_PBR_MATERIAL.cameraExposure = 0.66;
    this.liquid_PBR_MATERIAL.cameraContrast = 2;
    this.liquid_PBR_MATERIAL.microSurface = 1;
    this.liquid_PBR_MATERIAL.reflectivityColor = BABYLON.Color3.FromHexString('#fd9236');
    this.liquid_PBR_MATERIAL.albedoColor = BABYLON.Color3.FromHexString('#fd9236'); */

    // this.liquid_PBR_MATERIAL = new BABYLON.StandardMaterial("liquid_PBR_MATERIAL", this.scene);
    // this.liquid_PBR_MATERIAL.specularColor = new BABYLON.Color3(1, 0, 0);
    // this.liquid_PBR_MATERIAL.ambientColor = BABYLON.Color3.FromHexString('#fd9236');
    // this.liquid_PBR_MATERIAL.specularColor = BABYLON.Color3.FromHexString('#fd9236');

    BABYLON.SceneLoader.ImportMeshAsync("liquid", "../../assets/glb/page-001/", "liquid.glb", this.scene).then((result) => {
      this.liquid = this.scene.getMeshByName("liquid");
      // this.liquid.material = this.liquid_PBR_MATERIAL;
    });

    // BOTTLE

    this.bottle_PBR_MATERIAL = new BABYLON.PBRMaterial("bootle_PBR_MATERIAL", this.scene);
    /* this.bootle_PBR_MATERIAL.metallic = 0.0;
    this.bootle_PBR_MATERIAL.roughness = 0;
    this.bootle_PBR_MATERIAL.subSurface.isRefractionEnabled = true; */

    var probe = new BABYLON.ReflectionProbe("main", 512, this.scene);
    probe.attachToMesh(this.bottle);
    probe.renderList.push(this.liquid);

    this.bottle_PBR_MATERIAL.albedoColor = new BABYLON.Color3(1, 1, 1);
    // this.bottle_PBR_MATERIAL.subSurface.isRefractionEnabled = true;
    // this.bottle_PBR_MATERIAL.refractionTexture = new BABYLON.RefractionTexture("ref", 1024, this.scene, true);
    this.bottle_PBR_MATERIAL.linkRefractionWithTransparency = true;
    this.bottle_PBR_MATERIAL.refractionTexture = probe.cubeTexture;
    this.bottle_PBR_MATERIAL.realTimeFiltering = true;
    this.bottle_PBR_MATERIAL.indexOfRefraction = 1.52;
    // this.bottle_PBR_MATERIAL.refractionTexture.depth = 5;
    this.bottle_PBR_MATERIAL.subSurface.refractionIntensity = 1.52;
    this.bottle_PBR_MATERIAL.subSurface.indexOfRefraction = 1.52;
    this.bottle_PBR_MATERIAL.metallic = 0.0;
    this.bottle_PBR_MATERIAL.roughness = 0;
    this.bottle_PBR_MATERIAL.alpha = 0.2;

    /* this.bottle_PBR_MATERIAL.metallic = 0.0;
    this.bottle_PBR_MATERIAL.roughness = 0;
    this.bottle_PBR_MATERIAL.subSurface.isRefractionEnabled = true;
    this.bottle_PBR_MATERIAL.indexOfRefraction = 1.52;
    // this.bottle_PBR_MATERIAL.linkRefractionWithTransparency = true;
    this.bottle_PBR_MATERIAL.alpha = 0.2;
    this.bottle_PBR_MATERIAL.directIntensity = 0.0;
    this.bottle_PBR_MATERIAL.environmentIntensity = 0.3;
    this.bottle_PBR_MATERIAL.cameraExposure = 0.66;
    this.bottle_PBR_MATERIAL.cameraContrast = 2;
    this.bottle_PBR_MATERIAL.microSurface = 1;
    this.bottle_PBR_MATERIAL.reflectivityColor = new BABYLON.Color3(1, 1, 1);
    this.bottle_PBR_MATERIAL.albedoColor = new BABYLON.Color3(1, 1, 1); */

    BABYLON.SceneLoader.ImportMeshAsync("bottle", "../../assets/glb/page-001/", "bottle.glb", this.scene).then((result) => {
      this.bottle = this.scene.getMeshByName("bottle");
      this.bottle.material = this.bottle_PBR_MATERIAL;
      /* this.bottle.actionManager = new BABYLON.ActionManager(this.scene);

      const bottle_ANIMATION = new BABYLON.Animation("bottle_ANIMATION", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      const bottle_ANIMATION_Keys = [];
      bottle_ANIMATION_Keys.push({
          frame: 0,
          value: 0
      });
      bottle_ANIMATION_Keys.push({
          frame: 30,
          value: 2 * Math.PI
      });
      bottle_ANIMATION.setKeys(bottle_ANIMATION_Keys);
      this.bottle.animations = [];
      this.bottle.animations.push(bottle_ANIMATION);
      this.scene.beginAnimation(this.bottle, 0, 30, true); */
    });

    // TAP

    BABYLON.SceneLoader.ImportMeshAsync("tap", "../../assets/glb/page-001/", "tap.glb", this.scene).then((result) => {
      this.tap = this.scene.getMeshByName("tap");
    });

    // ETIQUETTE

    BABYLON.SceneLoader.ImportMeshAsync("etiquette", "../../assets/glb/page-001/", "etiquette.glb", this.scene).then((result) => {
      this.etiquette = this.scene.getMeshByName("etiquette");
    });

    // GROUND

    // this.ground_PBR_MATERIAL = new BABYLON.PBRMaterial("ground_MATERIAL", this.scene);
    // this.ground_PBR_MATERIAL.metallic = 1;
    // this.ground_PBR_MATERIAL.roughness = 0.6;
    // this.ground_PBR_MATERIAL.albedoColor = BABYLON.Color3.FromHexString('#ff5859');

    // this.ground_PBR_MATERIAL = new BABYLON.PBRSpecularGlossinessMaterial("ground_MATERIAL", this.scene);
    // this.ground_PBR_MATERIAL.metallic = 0;
    // this.ground_PBR_MATERIAL.roughness = 1;
    // this.ground_PBR_MATERIAL.diffuseColor = BABYLON.Color3.FromHexString('#ff5859');
    // this.ground_PBR_MATERIAL.specularColor = BABYLON.Color3.FromHexString('#ff5859');
    // this.ground_PBR_MATERIAL.glossiness = 0;
    // this.ground_PBR_MATERIAL.specularColor = BABYLON.Color3.FromHexString('#ff5859');

    // this.ground = BABYLON.MeshBuilder.CreatePlane("ground", {height:20, width: 20, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    // this.ground.rotation.x = Math.PI/2;
    // this.ground.material = this.ground_PBR_MATERIAL;

    // this.ground.receiveShadows = true;

    // AXIS

    this.axis_X = BABYLON.MeshBuilder.CreateBox("axis_X", {height: 0.2, width: 0.2, depth: 0.2});
    this.axis_X.position = new BABYLON.Vector3(5, 0, 0);
    this.axis_X_MATERIAL = new BABYLON.StandardMaterial("axis_X_MATERIAL", this.scene);
    this.axis_X_MATERIAL.diffuseColor = new BABYLON.Color3(1, 0, 0);
    this.axis_X_MATERIAL.specularColor = new BABYLON.Color3(1, 0, 0);
    this.axis_X.material = this.axis_X_MATERIAL;

    this.axis_Y = BABYLON.MeshBuilder.CreateBox("axis_Y", {height: 0.2, width: 0.2, depth: 0.2});
    this.axis_Y.position = new BABYLON.Vector3(0, 0, 5);
    this.axis_Y_MATERIAL = new BABYLON.StandardMaterial("axis_Y_MATERIAL", this.scene);
    this.axis_Y_MATERIAL.diffuseColor = new BABYLON.Color3(0, 1, 0);
    this.axis_Y_MATERIAL.specularColor = new BABYLON.Color3(0, 1, 0);
    this.axis_Y.material = this.axis_Y_MATERIAL;

    this.axis_Z = BABYLON.MeshBuilder.CreateBox("axis_Z", {height: 0.2, width: 0.2, depth: 0.2});
    this.axis_Z.position = new BABYLON.Vector3(0, 5, 0);
    this.axis_Z_MATERIAL = new BABYLON.StandardMaterial("axis_Z_MATERIAL", this.scene);
    this.axis_Z_MATERIAL.diffuseColor = new BABYLON.Color3(0, 0, 1);
    this.axis_Z_MATERIAL.specularColor = new BABYLON.Color3(0, 0, 1);
    this.axis_Z.material = this.axis_Z_MATERIAL;
  }

  // ANIMATE

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  // CLEAN UP

  public cleanUp() {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    this.engine.dispose();
  }
}
