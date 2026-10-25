import * as THREE from 'three';

export class CyberParticles {
  constructor(count = 1800) {
    this.count = count;
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    const colorWhite = new THREE.Color(0xf8fafc); // Crisp matte white
    const colorGreen = new THREE.Color(0x10b981); // Matte emerald green
    const colorDim = new THREE.Color(0x94a3b8);   // Muted matte slate

    const aspect = (window.innerWidth / window.innerHeight) || (16 / 9);
    const fovRad = (45 * Math.PI) / 360;

    for (let i = 0; i < count; i++) {
      // Depth spread between -25 and +4 (camera is at z = 14)
      const z = -25 + Math.random() * 29;
      const dist = 14 - z;
      const visibleHalfH = dist * Math.tan(fovRad);
      const visibleHalfW = visibleHalfH * aspect;

      // Even 50/50 distribution across both left and right sides
      let x;
      if (i % 2 === 0) {
        // Left side star
        x = -Math.random() * (visibleHalfW * 1.05);
      } else {
        // Right side star
        x = Math.random() * (visibleHalfW * 1.05);
      }

      const y = (Math.random() - 0.5) * 2 * (visibleHalfH * 1.05);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Matte color distribution
      const rand = Math.random();
      const c = rand < 0.6 ? colorWhite : (rand < 0.85 ? colorGreen : colorDim);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.originalPositions = originalPositions;

    // Smooth antialiased circular texture for delicate stars
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    // Delicate star size with low opacity (matte, non-distracting background)
    this.material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  update(time, scrollOffset = 0) {
    // Gentle 2D floating & parallax (DO NOT rotate Y to prevent stars from sweeping away from right/left)
    this.mesh.position.y = (scrollOffset * 0.003) + Math.sin(time * 0.25) * 0.15;
    this.mesh.position.x = Math.cos(time * 0.2) * 0.1;
  }
}
