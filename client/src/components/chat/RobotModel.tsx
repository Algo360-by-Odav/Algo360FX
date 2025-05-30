import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Box } from '@mui/material';

interface RobotModelProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  size?: number;
  fullScreen?: boolean;
}

const RobotModel: React.FC<RobotModelProps> = ({
  isActive,
  isListening,
  isSpeaking,
  onClick,
  onDoubleClick,
  size = 200,
  fullScreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  
  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.background.set(0x000000);
    scene.background.convertSRGBToLinear();
    // Use renderer with alpha instead of setAlpha
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      1, // We'll update this in the resize handler
      0.1, 
      1000
    );
    camera.position.z = 5;
    camera.position.y = 1;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls if in fullScreen mode
    if (fullScreen) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = false;
      controlsRef.current = controls;
    }
    
    // Create robot
    const robot = new THREE.Group();
    
    // Create a platform for the robot
    const platformGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const platformMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0a0a0a,
      emissive: 0x0066ff,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1.2;
    platform.receiveShadow = true;
    platform.name = 'platform';
    robot.add(platform);
    
    // Add grid lines to platform
    const gridHelper = new THREE.GridHelper(2, 10, 0x0066ff, 0x0066ff);
    gridHelper.position.y = -1.15;
    gridHelper.name = 'gridHelper';
    robot.add(gridHelper);
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    body.name = 'body';
    robot.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1;
    head.castShadow = true;
    head.name = 'head';
    robot.add(head);
    
    // Face/Screen
    const faceGeometry = new THREE.PlaneGeometry(0.8, 0.4);
    const faceMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00aaff,
      transparent: true
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.z = 0.55;
    face.position.y = 1;
    face.name = 'face';
    robot.add(face);
    
    // Create visualizer bars for the face
    const barGroup = new THREE.Group();
    barGroup.position.set(0, 1, 0.56);
    barGroup.name = 'barGroup';
    
    const barWidth = 0.05;
    const barDepth = 0.01;
    const barGap = 0.02;
    const barCount = 10;
    const totalWidth = barCount * (barWidth + barGap) - barGap;
    
    for (let i = 0; i < barCount; i++) {
      const barGeometry = new THREE.BoxGeometry(barWidth, 0.2, barDepth);
      const barMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      
      bar.position.x = -totalWidth / 2 + i * (barWidth + barGap) + barWidth / 2;
      barGroup.add(bar);
      
      // Store original height for animation
      (bar as any).baseHeight = 0.2;
      (bar as any).targetHeight = 0.2;
    }
    
    robot.add(barGroup);
    
    // Ears/Antennas
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const leftAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    leftAntenna.position.set(-0.3, 1.5, 0);
    leftAntenna.castShadow = true;
    robot.add(leftAntenna);
    
    const rightAntenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    rightAntenna.position.set(0.3, 1.5, 0);
    rightAntenna.castShadow = true;
    robot.add(rightAntenna);
    
    // Antenna tips
    const antennaTipGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const antennaTipMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    
    const leftAntennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
    leftAntennaTip.position.set(-0.3, 1.65, 0);
    leftAntennaTip.name = 'leftAntennaTip';
    robot.add(leftAntennaTip);
    
    const rightAntennaTip = new THREE.Mesh(antennaTipGeometry, antennaTipMaterial);
    rightAntennaTip.position.set(0.3, 1.65, 0);
    rightAntennaTip.name = 'rightAntennaTip';
    robot.add(rightAntennaTip);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1, 0, 0);
    leftArm.rotation.z = Math.PI / 2;
    leftArm.castShadow = true;
    leftArm.name = 'leftArm';
    robot.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1, 0, 0);
    rightArm.rotation.z = -Math.PI / 2;
    rightArm.castShadow = true;
    rightArm.name = 'rightArm';
    robot.add(rightArm);
    
    // Hands
    const handGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const handMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const leftHand = new THREE.Mesh(handGeometry, handMaterial);
    leftHand.position.set(-1.4, 0, 0);
    leftHand.castShadow = true;
    leftHand.name = 'leftHand';
    robot.add(leftHand);
    
    const rightHand = new THREE.Mesh(handGeometry, handMaterial);
    rightHand.position.set(1.4, 0, 0);
    rightHand.castShadow = true;
    rightHand.name = 'rightHand';
    robot.add(rightHand);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.8, 0);
    leftLeg.castShadow = true;
    leftLeg.name = 'leftLeg';
    robot.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.8, 0);
    rightLeg.castShadow = true;
    rightLeg.name = 'rightLeg';
    robot.add(rightLeg);
    
    // Feet
    const footGeometry = new THREE.BoxGeometry(0.25, 0.1, 0.5);
    const footMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.3, -1.25, 0.1);
    leftFoot.castShadow = true;
    leftFoot.name = 'leftFoot';
    robot.add(leftFoot);
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.3, -1.25, 0.1);
    rightFoot.castShadow = true;
    rightFoot.name = 'rightFoot';
    robot.add(rightFoot);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add a spotlight from below for dramatic effect
    const spotLight = new THREE.SpotLight(0x0066ff, 1);
    spotLight.position.set(0, -3, 2);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
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
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (robotRef.current) {
        // Rotate robot slightly for a "floating" effect
        if (!fullScreen) {
          robotRef.current.rotation.y += 0.01;
        }
        
        // Pulse effect when active or hovered
        if (isActive || isHovered) {
          const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
          robotRef.current.scale.set(scale, scale, scale);
        } else {
          robotRef.current.scale.set(1, 1, 1);
        }
        
        // Listening effect - antenna tips pulsing
        if (isListening) {
          const leftTip = robotRef.current.getObjectByName('leftAntennaTip') as THREE.Mesh;
          const rightTip = robotRef.current.getObjectByName('rightAntennaTip') as THREE.Mesh;
          
          if (leftTip && rightTip) {
            const pulseFactor = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
            (leftTip.material as THREE.MeshPhongMaterial).emissiveIntensity = pulseFactor;
            (rightTip.material as THREE.MeshPhongMaterial).emissiveIntensity = pulseFactor;
          }
        }
        
        // Speaking effect - visualizer bars animation
        const barGroup = robotRef.current.getObjectByName('barGroup') as THREE.Group;
        if (barGroup && isSpeaking) {
          barGroup.children.forEach((bar) => {
            if (Date.now() % 100 === 0) {
              (bar as any).targetHeight = 0.05 + Math.random() * 0.3;
            }
            
            const currentHeight = (bar as THREE.Mesh).scale.y * (bar as any).baseHeight;
            const targetHeight = (bar as any).targetHeight;
            const newHeight = currentHeight + (targetHeight - currentHeight) * 0.1;
            
            (bar as THREE.Mesh).scale.y = newHeight / (bar as any).baseHeight;
            (bar as THREE.Mesh).position.y = (newHeight - (bar as any).baseHeight) / 2;
          });
        } else if (barGroup) {
          barGroup.children.forEach((bar) => {
            (bar as THREE.Mesh).scale.y = 1;
            (bar as THREE.Mesh).position.y = 0;
          });
        }
        
        // Arm movement when active
        if (isActive) {
          const leftArm = robotRef.current.getObjectByName('leftArm') as THREE.Mesh;
          const rightArm = robotRef.current.getObjectByName('rightArm') as THREE.Mesh;
          const leftHand = robotRef.current.getObjectByName('leftHand') as THREE.Mesh;
          const rightHand = robotRef.current.getObjectByName('rightHand') as THREE.Mesh;
          
          if (leftArm && rightArm && leftHand && rightHand) {
            const armAngle = Math.sin(Date.now() * 0.001) * 0.2;
            leftArm.rotation.z = Math.PI / 2 + armAngle;
            rightArm.rotation.z = -Math.PI / 2 - armAngle;
            
            leftHand.position.x = -1.4 + Math.sin(armAngle) * 0.2;
            leftHand.position.y = Math.cos(armAngle) * 0.2;
            rightHand.position.x = 1.4 - Math.sin(armAngle) * 0.2;
            rightHand.position.y = Math.cos(armAngle) * 0.2;
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
  }, [isActive, isListening, isSpeaking, isHovered, fullScreen]);
  
  return (
    <Box
      ref={containerRef}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: fullScreen ? '100%' : `${size}px`,
        height: fullScreen ? '100%' : `${size}px`,
        cursor: 'pointer',
        borderRadius: fullScreen ? 0 : '50%',
        overflow: 'hidden',
        backgroundColor: fullScreen ? 'transparent' : 'primary.main',
        boxShadow: fullScreen ? 'none' : 3
      }}
    />
  );
};

export default RobotModel;
