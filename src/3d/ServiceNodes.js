import * as THREE from 'three';

export class ServiceNodes {
  constructor() {
    this.group = new THREE.Group();
    this.nodes = [];

    const nodeData = [
      {
        name: 'Web Development',
        color: 0x00ff87,
        emissive: 0x047857,
        geo: new THREE.OctahedronGeometry(0.38, 0),
        angle: 0,
        dist: 3.6,
        orbitSpeed: 0.22,
        yOffset: 0.8
      },
      {
        name: 'UI/UX Design',
        color: 0xffffff,
        emissive: 0x34d399,
        geo: new THREE.DodecahedronGeometry(0.32, 0),
        angle: Math.PI * 0.5,
        dist: 3.8,
        orbitSpeed: 0.18,
        yOffset: -0.7
      },
      {
        name: 'Video Editing',
        color: 0x34d399,
        emissive: 0x059669,
        geo: new THREE.TorusGeometry(0.28, 0.1, 12, 28),
        angle: Math.PI,
        dist: 3.5,
        orbitSpeed: 0.25,
        yOffset: 0.6
      },
      {
        name: 'Digital Marketing & IT',
        color: 0x10b981,
        emissive: 0x064e3b,
        geo: new THREE.TetrahedronGeometry(0.38, 0),
        angle: Math.PI * 1.5,
        dist: 3.9,
        orbitSpeed: 0.2,
        yOffset: -0.5
      }
    ];

    nodeData.forEach((data) => {
      const nodeGroup = new THREE.Group();

      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.8,
        metalness: 0.1,
        wireframe: false
      });

      const mesh = new THREE.Mesh(data.geo, mat);
      nodeGroup.add(mesh);

      // Matte thin orbit ring
      const auraGeo = new THREE.RingGeometry(0.45, 0.48, 24);
      const auraMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
        blending: THREE.NormalBlending
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      nodeGroup.add(auraMesh);

      nodeGroup.userData = {
        name: data.name,
        baseAngle: data.angle,
        dist: data.dist,
        speed: data.orbitSpeed,
        yOffset: data.yOffset,
        mesh: mesh,
        aura: auraMesh
      };

      this.nodes.push(nodeGroup);
      this.group.add(nodeGroup);
    });

    this.baseX = 4.4;
    this.baseY = 0;
    this.group.position.set(this.baseX, this.baseY, 0);
    this.group.scale.set(0.72, 0.72, 0.72);
  }

  update(time, scrollOffset = 0) {
    this.nodes.forEach((node) => {
      const { baseAngle, dist, speed, yOffset, mesh, aura } = node.userData;
      const angle = baseAngle + time * speed;

      node.position.x = Math.cos(angle) * dist;
      node.position.z = Math.sin(angle) * dist * 0.7;
      node.position.y = yOffset + Math.sin(time * 1.5 + baseAngle) * 0.25;

      mesh.rotation.x += 0.015;
      mesh.rotation.y += 0.02;

      aura.rotation.z = time * 0.8;
      aura.lookAt(0, 0, 10);
    });

    // Match root core's scroll behavior
    const isMobile = window.innerWidth < 900;
    const scrollMoveY = isMobile ? 0 : (scrollOffset / window.innerHeight) * 12;
    this.group.position.y = this.baseY + scrollMoveY;

    const scrollFade = Math.max(0, 1 - scrollOffset / (window.innerHeight * (isMobile ? 0.2 : 0.9)));
    const currentBaseScale = isMobile ? 0.32 : 0.75;
    const finalScale = currentBaseScale * Math.max(0.01, scrollFade);
    this.group.scale.set(finalScale, finalScale, finalScale);
    this.group.visible = scrollFade > 0.02;
  }

  setResponsivePosition(isMobile) {
    if (isMobile) {
      this.baseX = 0;
      this.baseY = 4.9;
      this.group.position.set(0, 4.9, -3);
      this.group.scale.set(0.34, 0.34, 0.34);
    } else {
      this.baseX = 4.4;
      this.baseY = 0;
      this.group.position.set(4.4, 0, 0);
      this.group.scale.set(0.72, 0.72, 0.72);
    }
  }
}
