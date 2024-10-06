"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber'
import { OrbitControls, TransformControls } from 'three-stdlib'
extend({ OrbitControls, TransformControls })


interface Planet {
  name: string;
  radius: number;
  distance: number;
  color: string;
  rotationSpeed: number;
  orbitalSpeed: number;
}

interface NEO {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
    miss_distance: {
      astronomical: string;
    };
    relative_velocity: {
      kilometers_per_second: string;
    };
    close_approach_date: string;
  }>;
  is_potentially_hazardous_asteroid: boolean;
}

interface SolarSystemProps {
  neoData: NEO[];
  onNEOClick: (neo: NEO) => void;
}

const PLANETS: Planet[] = [
  { name: 'Mercury', radius: 0.383, distance: 3.5, color: '#A0522D', rotationSpeed: 0.01, orbitalSpeed: 0.04 },
  { name: 'Venus', radius: 0.949, distance: 6.7, color: '#DEB887', rotationSpeed: 0.009, orbitalSpeed: 0.015 },
  { name: 'Earth', radius: 1, distance: 10, color: '#4169E1', rotationSpeed: 0.008, orbitalSpeed: 0.01 },
  { name: 'Mars', radius: 0.532, distance: 15.2, color: '#CD5C5C', rotationSpeed: 0.007, orbitalSpeed: 0.008 }
];

const SolarSystem: React.FC<SolarSystemProps> = ({ neoData, onNEOClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  console.log("SolarSystem rendered:", { neoData, mountRef });
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("useEffect triggered");
      const mountNode = mountRef.current;//Transfer 
      if (!mountNode) {
        console.log("mountRef.current is null");
        return;
      }

      
     
      // Scene setup
      console.log("Setting up scene with neoData:", neoData);
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      scene.add(ambientLight, pointLight);

      // Sun
      const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);

      // Add planets
      const planets = PLANETS.map(planet => {
        const geometry = new THREE.SphereGeometry(planet.radius * 0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: planet.color });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Create orbit
        const orbitGeometry = new THREE.RingGeometry(planet.distance, planet.distance + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x666666,
          side: THREE.DoubleSide,
          opacity: 0.3,
          transparent: true
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        
        scene.add(orbit);
        scene.add(mesh);
        
        return { mesh, distance: planet.distance, speed: planet.orbitalSpeed };
      });

      // Add NEOs
      const neoObjects = neoData.map(neo => {
        const size = (neo.estimated_diameter.kilometers.estimated_diameter_max + 
                     neo.estimated_diameter.kilometers.estimated_diameter_min) / 4;
        
        const geometry = new THREE.SphereGeometry(size * 0.1, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xff0000,
          emissive: 0xff0000,
          emissiveIntensity: 0.5
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position NEO relative to Earth
        const distance = parseFloat(neo.close_approach_data[0].miss_distance.astronomical) * 2;
        mesh.position.set(
          10 + distance * Math.cos(Math.random() * Math.PI * 2),
          distance * Math.sin(Math.random() * Math.PI * 2),
          0
        );
        
        // Add click handler
        mesh.userData.neo = neo;
        
        scene.add(mesh);
        return mesh;
      });

      // Camera positioning
      camera.position.z = 30;
      camera.position.y = 20;
      camera.lookAt(0, 0, 0);

      // Animation loop
      let time = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate planets
        planets.forEach((planet, index) => {
          const angle = time * planet.speed;
          planet.mesh.position.x = Math.cos(angle) * planet.distance;
          planet.mesh.position.z = Math.sin(angle) * planet.distance;
          planet.mesh.rotation.y += PLANETS[index].rotationSpeed;
        });

        // Update controls
        controls.update();
        
        time += 0.01;
        renderer.render(scene, camera);
      };

      // Raycaster for click detection
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onClick = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(neoObjects);

        if (intersects.length > 0) {
          const neo = intersects[0].object.userData.neo;
          onNEOClick(neo);
        }
      };

      window.addEventListener('click', onClick);
      setIsLoading(false);
      animate();

      // Clean up
      return () => {
        window.removeEventListener('click', onClick);
        if (mountNode) {
          mountNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }, 0); // Delay of 0ms

    return () => clearTimeout(timer);
  }, [neoData, onNEOClick]);

  if (isLoading) {
    return <div className="text-white flex items-center justify-center h-[600px]">Loading solar system...</div>;
  }

  return <div ref={mountRef} className="h-[600px] w-full" />;
};

export default SolarSystem;