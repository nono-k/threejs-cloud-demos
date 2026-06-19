/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import * as THREE from 'three';
import { Controls, OrthographicCamera } from './core/Camera';
import { Three } from './core/Three';
import { Gui } from './Gui';
import planeFragment from './shaders/plane-fragment.glsl';
import skyFragment from './shaders/plane-sky.glsl';
import vertex from './shaders/vertex.glsl';

export class App extends Three {
  private readonly camera: OrthographicCamera;
  private skyMesh!: THREE.Mesh;
  private cloudMesh!: THREE.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.camera = new OrthographicCamera({ left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
    this.camera.position.z = 1;

    new Controls(this.renderer, this.camera);

    this.init();
    this.createGeometry();

    this.setGui();

    window.addEventListener('resize', this.resize.bind(this));
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private init() {
    // this.scene.background = new THREE.Color('#222222');
  }

  private createGeometry() {
    const geometry = new THREE.PlaneGeometry(2, 2);

    const skyMaterial = new THREE.ShaderMaterial({
      depthWrite: false,
      vertexShader: vertex,
      fragmentShader: skyFragment,
    });

    this.skyMesh = new THREE.Mesh(geometry, skyMaterial);
    this.scene.add(this.skyMesh);

    const cloudMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: vertex,
      fragmentShader: planeFragment,
      uniforms: {
        uTime: { value: 0 },
        uScaleX: { value: 3.0 },
        uScaleY: { value: 5.0 },
        uDetail: { value: 6 },
        uRoughness: { value: 0.75 },
        uDensity: { value: 0.15 },
        uDistortion: { value: 0.05 },
        uEdgeSoftness: { value: 0.4 },
      },
    });

    this.cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
    this.cloudMesh.position.z = 0;
    this.scene.add(this.cloudMesh);
  }

  private setGui() {
    const PARAMS = {
      scaleX: 3.0,
      scaleY: 5.0,
      detail: 6,
      roughness: 0.75,
      density: 0.15,
      distortion: 0.05,
      edgeSoftness: 0.4,
    };

    const pane = new Gui();
    pane.addBinding(PARAMS, 'scaleX', { min: 0, max: 10 });
    pane.addBinding(PARAMS, 'scaleY', { min: 0, max: 10 });
    pane.addBinding(PARAMS, 'detail', { min: 1, max: 10, step: 1 });
    pane.addBinding(PARAMS, 'roughness', { min: 0, max: 1 });
    pane.addBinding(PARAMS, 'density', { min: 0, max: 1 });
    pane.addBinding(PARAMS, 'distortion', { min: 0, max: 1 });
    pane.addBinding(PARAMS, 'edgeSoftness', { min: 0, max: 1 });

    pane.on('change', () => {
      const material = this.cloudMesh.material as THREE.ShaderMaterial;

      material.uniforms.uScaleX!.value = PARAMS.scaleX;
      material.uniforms.uScaleY!.value = PARAMS.scaleY;
      material.uniforms.uDetail!.value = PARAMS.detail;
      material.uniforms.uRoughness!.value = PARAMS.roughness;
      material.uniforms.uDensity!.value = PARAMS.density;
      material.uniforms.uDistortion!.value = PARAMS.distortion;
      material.uniforms.uEdgeSoftness!.value = PARAMS.edgeSoftness;
    });
  }

  private animate() {
    const delta = this.clock.getDelta();
    const material = this.cloudMesh.material as THREE.ShaderMaterial;

    if (material.uniforms.uTime) {
      material.uniforms.uTime.value += delta;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    this.camera.update();
  }
}

const app = new App(document.getElementById('webgl') as HTMLCanvasElement);

window.addEventListener('beforeunload', () => {
  app.dispose();
});
