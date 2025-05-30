import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Box } from '@mui/material';

interface SimpleRobot3DProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  size?: number;
}

const SimpleRobot3D: React.FC<SimpleRobot3DProps> = ({
  isActive,
  isListening,
  isSpeaking,
  onClick,
  onDoubleClick,
  size = 70
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);
  const headRef = useRef<THREE.Mesh | null>(null);
  const eyesRef = useRef<THREE.Mesh | null>(null);
  const antennaLeftRef = useRef<THREE.Mesh | null>(null);
  const antennaRightRef = useRef<THREE.Mesh | null>(null);

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create robot
    const robot = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.2, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.2;
    robot.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.9;
    robot.add(head);
    headRef.current = head;
    
    // Eyes/Screen
    const eyesGeometry = new THREE.PlaneGeometry(0.8, 0.4);
    const eyesMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00aaff,
      side: THREE.DoubleSide,
      emissive: 0x00aaff,
      emissiveIntensity: 0.5,
      shininess: 90
    });
    const eyes = new THREE.Mesh(eyesGeometry, eyesMaterial);
    eyes.position.z = 0.6;
    eyes.position.y = 0.9;
    robot.add(eyes);
    eyesRef.current = eyes;
    
    // Antennas
    const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const antennaLeft = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antennaLeft.position.set(-0.3, 1.5, 0);
    robot.add(antennaLeft);
    antennaLeftRef.current = antennaLeft;
    
    const antennaRight = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antennaRight.position.set(0.3, 1.5, 0);
    robot.add(antennaRight);
    antennaRightRef.current = antennaRight;
    
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
        // Gentle floating rotation
        robotRef.current.rotation.y += 0.005;
        
        // Floating up and down slightly
        robotRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Active state - pulse effect
        if (isActive) {
          const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
          robotRef.current.scale.x = pulseScale;
          robotRef.current.scale.y = pulseScale;
          robotRef.current.scale.z = pulseScale;
          
          // Head bobbing when active
          if (headRef.current) {
            headRef.current.position.y = 0.9 + Math.sin(Date.now() * 0.002) * 0.05;
          }
        } else {
          robotRef.current.scale.set(1, 1, 1);
          if (headRef.current) {
            headRef.current.position.y = 0.9;
          }
        }
        
        // Listening state - antenna animation
        if (isListening && antennaLeftRef.current && antennaRightRef.current) {
          // More pronounced pulsing for antennas
          const scaleLeft = 1 + Math.sin(Date.now() * 0.01) * 0.3;
          const scaleRight = 1 + Math.sin((Date.now() + 300) * 0.01) * 0.3; // Offset for alternating effect
          antennaLeftRef.current.scale.y = scaleLeft;
          antennaRightRef.current.scale.y = scaleRight;
          
          // Rotate antennas slightly
          antennaLeftRef.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.2;
          antennaRightRef.current.rotation.z = -Math.sin(Date.now() * 0.005) * 0.2;
        } else if (antennaLeftRef.current && antennaRightRef.current) {
          antennaLeftRef.current.scale.y = 1;
          antennaRightRef.current.scale.y = 1;
          antennaLeftRef.current.rotation.z = 0;
          antennaRightRef.current.rotation.z = 0;
        }
        
        // Speaking state - dynamic color changes
        if (isSpeaking && eyesRef.current) {
          const material = eyesRef.current.material as THREE.MeshPhongMaterial;
          
          // More vibrant color cycling
          const hue = (Date.now() % 2000) / 2000; // Slower color cycle
          material.color.setHSL(hue, 0.8, 0.6);
          material.emissive.setHSL(hue, 1, 0.5);
          
          // Pulse the emissive intensity based on speaking
          material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
        } else if (eyesRef.current) {
          const material = eyesRef.current.material as THREE.MeshPhongMaterial;
          material.color.set(0x00aaff);
          material.emissive.set(0x00aaff);
          material.emissiveIntensity = 0.5;
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
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
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
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 20px rgba(0, 120, 255, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 6px 25px rgba(0, 120, 255, 0.4)',
        }
      }}
    />
  );
};

export default SimpleRobot3D;
