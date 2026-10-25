import * as THREE from 'three';
import { CyberParticles } from './Particles.js';
import { RootByteCore } from './RootByteCore.js';
import { ServiceNodes } from './ServiceNodes.js';

export class SceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    if (!this.canvas) return;

    this.isRunning = false;
    this.clock = new THREE.Clock();

    // Mouse coordinates for gentle parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = window.scrollY || 0;

    this.init();
    this.setupLighting();
    this.setupObjects();
    this.setupEventListeners();
    this.start();
  }

  init() {
    this.scene = new THREE.Scene();

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    this.camera.position.set(0, 0, 14);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.animate = this.animate.bind(this);
  }

  setupLighting() {
    // Clean, balanced ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    // Soft directional light from top right
    const dirLight1 = new THREE.DirectionalLight(0xf1f5f9, 1.0);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    // Soft fill from bottom left
    const dirLight2 = new THREE.DirectionalLight(0x10b981, 0.6);
    dirLight2.position.set(-6, -6, 5);
    this.scene.add(dirLight2);
  }

  setupObjects() {
    // 1. Full-page matte starfield spanning both left and right sides
    this.particles = new CyberParticles(1600);
    this.scene.add(this.particles.mesh);

    // 2. Compact RootByte 3D core
    this.core = new RootByteCore();
    this.scene.add(this.core.group);

    // 3. Orbiting service nodes
    this.serviceNodes = new ServiceNodes();
    this.scene.add(this.serviceNodes.group);

    this.updateResponsivePositions();
  }

  updateResponsivePositions() {
    const isMobile = window.innerWidth < 900;
    if (this.core) this.core.setResponsivePosition(isMobile);
    if (this.serviceNodes) this.serviceNodes.setResponsivePosition(isMobile);
  }

  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.handleMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      }
    }, { passive: true });
  }

  handleScroll() {
    this.scrollY = window.scrollY || 0;
  }

  handleMouseMove(e) {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    this.mouse.targetX = (e.clientX - halfWidth) / halfWidth;
    this.mouse.targetY = (e.clientY - halfHeight) / halfHeight;
  }

  handleResize() {
    if (!this.canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.updateResponsivePositions();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.clock.start();
      requestAnimationFrame(this.animate);
    }
  }

  stop() {
    this.isRunning = false;
    this.clock.stop();
  }

  animate() {
    if (!this.isRunning) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth lerp mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    this.camera.position.x = this.mouse.x * 1.2;
    this.camera.position.y = -this.mouse.y * 1.2;
    this.camera.lookAt(0, 0, 0);

    // Update starfield across full page and core
    if (this.particles) this.particles.update(elapsedTime, this.scrollY);
    if (this.core) this.core.update(elapsedTime, this.scrollY);
    if (this.serviceNodes) this.serviceNodes.update(elapsedTime, this.scrollY);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.renderer) this.renderer.dispose();
  }
}
