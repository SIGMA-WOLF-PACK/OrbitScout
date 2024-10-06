import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "three-stdlib";
extend({ OrbitControls, TransformControls });

interface Planet {
  name: string;
  radius: number;
  distance: number;
  color: string;
  rotationSpeed: number;
  orbitalSpeed: number;
}

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
  {
    name: "Mercury",
    radius: 0.383,
    distance: 3.5,
    color: "#A0522D",
    rotationSpeed: 0.01,
    orbitalSpeed: 0.04,
  },
  {
    name: "Venus",
    radius: 0.949,
    distance: 6.7,
    color: "#DEB887",
    rotationSpeed: 0.009,
    orbitalSpeed: 0.015,
  },
  {
    name: "Earth",
    radius: 1,
    distance: 10,
    color: "#4169E1",
    rotationSpeed: 0.008,
    orbitalSpeed: 0.01,
  },
  {
    name: "Mars",
    radius: 0.532,
    distance: 15.2,
    color: "#CD5C5C",
    rotationSpeed: 0.007,
    orbitalSpeed: 0.008,
  },
];

interface SolarSystemProps {
  neoData: NEO[];
  onNEOClick: (neo: NEO) => void;
}

interface SolarSystemProps {
  neoData: NEO[];
  onNEOClick: (neo: NEO) => void;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ neoData, onNEOClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20); // Position camera directly in front
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Clear and append
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0); // Center the sun
    scene.add(sun);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate sun
      sun.rotation.y += 0.005;

      // Update controls
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "600px", // Fixed height
        backgroundColor: "#000",
      }}
    />
  );
};

export default SolarSystem;
