import * as THREE from 'three';

export class RootByteCore {
  constructor() {
    this.group = new THREE.Group();

    // 1. Central Core: Refined matte faceted polyhedral form
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x161b18,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // 2. Outer Wireframe Lattice (Matte green)
    const wireGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.NormalBlending
    });
    this.wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(this.wireMesh);

    // 3. Compact Orbiting Gyro Ring 1 (Matte green)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.02, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 3;
    this.group.add(this.ring1);

    // 4. Compact Orbiting Gyro Ring 2 (Matte slate)
    const ring2Geo = new THREE.TorusGeometry(2.8, 0.02, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.NormalBlending
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.y = Math.PI / 4;
    this.ring2.rotation.x = -Math.PI / 6;
    this.group.add(this.ring2);

    // 5. Small Orbiting Data Cubes (Matte finish)
    this.byteCubes = [];
    const byteGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const byteMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.8,
      metalness: 0.1
    });

    for (let i = 0; i < 10; i++) {
      const cube = new THREE.Mesh(byteGeo, byteMat);
      const angle = (i / 10) * Math.PI * 2;
      const dist = 2.0 + (i % 3) * 0.25;
      cube.userData = {
        baseAngle: angle,
        speed: 0.35 + (i % 2) * 0.2,
        dist: dist,
        yOffset: ((i % 5) - 2) * 0.35
      };
      this.byteCubes.push(cube);
      this.group.add(cube);
    }

    // Default position and compact scale
    this.baseX = 4.4;
    this.baseY = 0;
    this.group.position.set(this.baseX, this.baseY, 0);
    this.group.scale.set(0.72, 0.72, 0.72);
  }

  update(time, scrollOffset = 0) {
    // Core spin
    this.coreMesh.rotation.y = time * 0.35;
    this.coreMesh.rotation.x = Math.sin(time * 0.2) * 0.2;

    // Wireframe counter-spin
    this.wireMesh.rotation.y = -time * 0.25;
    this.wireMesh.rotation.z = time * 0.15;

    // Rings rotation
    this.ring1.rotation.z = time * 0.4;
    this.ring1.rotation.y = Math.cos(time * 0.3) * 0.3;

    this.ring2.rotation.x = -time * 0.35;
    this.ring2.rotation.z = Math.sin(time * 0.25) * 0.4;

    // Orbiting data bytes
    this.byteCubes.forEach((cube) => {
      const { baseAngle, speed, dist, yOffset } = cube.userData;
      const currentAngle = baseAngle + time * speed;
      cube.position.x = Math.cos(currentAngle) * dist;
      cube.position.z = Math.sin(currentAngle) * dist;
      cube.position.y = yOffset + Math.sin(time * 2 + baseAngle) * 0.2;
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.03;
    });

    // Gentle floating respiration + scroll transition (moves smoothly out of view when scrolling down)
    const scrollMoveY = (scrollOffset / window.innerHeight) * 12;
    this.group.position.y = this.baseY + Math.sin(time * 0.8) * 0.2 + scrollMoveY;

    // Scale down slightly and fade as user scrolls past hero
    const scrollFade = Math.max(0, 1 - scrollOffset / (window.innerHeight * 0.9));
    const currentBaseScale = (window.innerWidth < 900) ? 0.55 : 0.75;
    const finalScale = currentBaseScale * Math.max(0.01, scrollFade);
    this.group.scale.set(finalScale, finalScale, finalScale);
    this.group.visible = scrollFade > 0.02;
  }

  setResponsivePosition(isMobile) {
    if (isMobile) {
      this.baseX = 0;
      this.baseY = -1.2;
      this.group.position.set(0, -1.2, -3);
      this.group.scale.set(0.55, 0.55, 0.55);
    } else {
      this.baseX = 4.4;
      this.baseY = 0;
      this.group.position.set(4.4, 0, 0);
      this.group.scale.set(0.72, 0.72, 0.72);
    }
  }
}
