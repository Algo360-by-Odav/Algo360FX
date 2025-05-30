import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Box } from '@mui/material';

interface Robot3DProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const Robot3D: React.FC<Robot3DProps> = ({ 
  isActive, 
  isListening, 
  isSpeaking, 
  onClick, 
  onDoubleClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);
  
  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      1, // We'll update this in the resize handler
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create robot
    const robot = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1976d2,
      shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    robot.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.2, 0.85);
    robot.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.2, 0.85);
    robot.add(rightEye);
    
    // Mouth
    const mouthGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32, Math.PI);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.3, 0.85);
    mouth.rotation.x = Math.PI;
    robot.add(mouth);
    
    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 32);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 1.2, 0);
    robot.add(antenna);
    
    const antennaTipGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const antennaTipMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const antennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
    antennaTip.position.set(0, 1.45, 0);
    robot.add(antennaTip);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    scene.add(robot);
    robotRef.current = robot;
    
    // Handle resizing
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    // Initial resize
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (robotRef.current) {
        // Rotate robot slightly for a "floating" effect
        robotRef.current.rotation.y += 0.01;
        
        // Pulse effect when active
        if (isActive) {
          const scale = 1 + Math.sin(Date.now() * 0.005) * 0.05;
          robotRef.current.scale.set(scale, scale, scale);
        } else {
          robotRef.current.scale.set(1, 1, 1);
        }
        
        // Listening effect - antenna tip pulsing
        if (isListening) {
          const antennaTip = robotRef.current.children[6] as THREE.Mesh;
          if (antennaTip) {
            const pulseFactor = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
            (antennaTip.material as THREE.MeshPhongMaterial).emissiveIntensity = pulseFactor;
          }
        }
        
        // Speaking effect - mouth animation
        if (isSpeaking) {
          const mouth = robotRef.current.children[4] as THREE.Mesh;
          if (mouth) {
            mouth.scale.y = 1 + Math.sin(Date.now() * 0.01) * 0.5;
          }
        }
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: THREE.Material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      rendererRef.current?.dispose();
    };
  }, [isActive, isListening, isSpeaking]);
  
  return (
    <Box
      ref={containerRef}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        borderRadius: '50%',
        overflow: 'hidden'
      }}
    />
  );
};

export default Robot3D;
