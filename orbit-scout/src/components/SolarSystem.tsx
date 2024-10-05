// // components/Orrery.js
// import { useEffect } from "react";
// import * as THREE from "three";

// const Orrery = ({ neos }) => {
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     // Create Sun
//     const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
//     const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//     const sun = new THREE.Mesh(sunGeometry, sunMaterial);
//     scene.add(sun);

//     // Create Earth
//     const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
//     const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//     const earth = new THREE.Mesh(earthGeometry, earthMaterial);
//     earth.position.set(3, 0, 0); // Adjust Earth's position
//     scene.add(earth);

//     // Create NEOs
//     neos.forEach((neo) => {
//       const neoGeometry = new THREE.SphereGeometry(0.1, 16, 16);
//       const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//       const neoObject = new THREE.Mesh(neoGeometry, neoMaterial);

//       // Set random position around Earth for now
//       neoObject.position.set(
//         Math.random() * 5 - 2.5,
//         Math.random() * 5 - 2.5,
//         Math.random() * 5 - 2.5
//       );
//       scene.add(neoObject);
//     });

//     camera.position.z = 5;

//     const animate = function () {
//       requestAnimationFrame(animate);
//       earth.rotation.y += 0.01;
//       sun.rotation.y += 0.01;

//       renderer.render(scene, camera);
//     };
//     animate();
//   }, [neos]);

//   return null;
// };

// export default Orrery;

"use client";

// components/SolarSystem.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SolarSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // Basic Sphere for the Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Camera positioning
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sun.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default SolarSystem;
