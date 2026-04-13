import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NetworkField({ count = 90, connections = 140 }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  const { basePositions, pointGeometry, lineGeometry, indices } = useMemo(() => {
    const basePositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // A wide, shallow volume behind the hero.
      basePositions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      basePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      basePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(basePositions.slice(), 3));

    const indices = new Uint16Array(connections * 2);
    for (let i = 0; i < connections; i++) {
      indices[i * 2] = Math.floor(Math.random() * count);
      indices[i * 2 + 1] = Math.floor(Math.random() * count);
    }

    const linePositions = new Float32Array(connections * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    return { basePositions, pointGeometry, lineGeometry, indices };
  }, [connections, count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const pointsGeom = pointsRef.current?.geometry;
    const linesGeom = linesRef.current?.geometry;
    if (!pointsGeom || !linesGeom) return;

    const pAttr = pointsGeom.getAttribute('position');
    const lAttr = linesGeom.getAttribute('position');

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3 + 0];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      const wobble = 0.18;
      const x = bx + Math.sin(t * 0.55 + i) * wobble;
      const y = by + Math.cos(t * 0.45 + i * 1.1) * wobble;
      const z = bz + Math.sin(t * 0.35 + i * 0.8) * (wobble * 0.6);

      pAttr.setXYZ(i, x, y, z);
    }

    for (let i = 0; i < indices.length / 2; i++) {
      const a = indices[i * 2];
      const b = indices[i * 2 + 1];

      const ax = pAttr.getX(a);
      const ay = pAttr.getY(a);
      const az = pAttr.getZ(a);

      const bx = pAttr.getX(b);
      const by = pAttr.getY(b);
      const bz = pAttr.getZ(b);

      lAttr.setXYZ(i * 2, ax, ay, az);
      lAttr.setXYZ(i * 2 + 1, bx, by, bz);
    }

    pAttr.needsUpdate = true;
    lAttr.needsUpdate = true;

    if (pointsRef.current) pointsRef.current.rotation.y = t * 0.03;
    if (linesRef.current) linesRef.current.rotation.y = t * 0.03;
  });

  return (
    <group position={[0, 0, -2.8]}>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          size={0.05}
          color={new THREE.Color('#9ef7d0')}
          opacity={0.75}
          transparent
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={new THREE.Color('#00ff66')}
          opacity={0.14}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 2, 2]} intensity={0.7} />
      <NetworkField />
    </Canvas>
  );
}
