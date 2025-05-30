// SplashScreen3D.js
// A 3D intro splash screen for Algo360FX

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, useTexture, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

// Extend the React Three Fiber elements
extend({ THREE });

// 3D Text component
const Logo3D = () => {
  const textRef = useRef();
  const matRef = useRef();
  
  // Create animated material
  useEffect(() => {
    if (matRef.current) {
      let hue = 0;
      const animate = () => {
        hue = (hue + 0.001) % 1;
        if (matRef.current) {
          const color = new THREE.Color();
          color.setHSL(hue, 0.8, 0.5);
          matRef.current.color = color;
        }
        requestAnimationFrame(animate);
      };
      const animationId = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  return React.createElement(
    Float, 
    { 
      speed: 2, 
      rotationIntensity: 0.2, 
      floatIntensity: 0.5
    },
    React.createElement(
      Center,
      {},
      React.createElement(
        Text3D,
        {
          ref: textRef,
          font: "/fonts/Inter_Bold.json",
          size: 1.5,
          height: 0.2,
          curveSegments: 32,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 8,
          children: "Algo360FX"
        },
        React.createElement(
          "meshStandardMaterial",
          {
            ref: matRef,
            color: "#1976d2",
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1
          }
        )
      )
    )
  );
};

// Trading graphs in the background
const TradingGraphs = () => {
  const graphRef = useRef();
  
  useEffect(() => {
    if (graphRef.current) {
      let time = 0;
      const animate = () => {
        time += 0.01;
        if (graphRef.current) {
          for (let i = 0; i < graphRef.current.geometry.attributes.position.array.length; i += 3) {
            const x = graphRef.current.geometry.attributes.position.array[i];
            graphRef.current.geometry.attributes.position.array[i + 1] = 
              Math.sin(x + time) * 0.2 * Math.sin(time * 0.5);
          }
          graphRef.current.geometry.attributes.position.needsUpdate = true;
        }
        requestAnimationFrame(animate);
      };
      const animationId = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  const graphPoints = [];
  const resolution = 100;
  
  for (let i = 0; i < resolution; i++) {
    const x = (i / resolution) * 15 - 7.5;
    const y = Math.sin(x) * 0.2;
    const z = -2;
    graphPoints.push(new THREE.Vector3(x, y, z));
  }

  return React.createElement(
    React.Fragment,
    null,
    [...Array(5)].map((_, index) => 
      React.createElement(
        "line",
        { key: index },
        [
          React.createElement(
            "bufferGeometry",
            { ref: index === 0 ? graphRef : null },
            React.createElement(
              "float32BufferAttribute", 
              {
                attach: "attributes-position", 
                count: graphPoints.length,
                array: Float32Array.from(graphPoints.flatMap(p => [p.x, p.y - index * 0.5, p.z])),
                itemSize: 3
              }
            )
          ),
          React.createElement(
            "lineBasicMaterial",
            { 
              color: index % 2 ? "#8CCCFF" : "#20A4FF",
              linewidth: 2 
            }
          )
        ]
      )
    )
  );
};

// Particle system for background ambiance
const ParticleField = () => {
  const particlesRef = useRef();
  const count = 1000;
  const positions = new Float32Array(count * 3);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    
    if (particlesRef.current) {
      let time = 0;
      const animate = () => {
        time += 0.001;
        if (particlesRef.current) {
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            particlesRef.current.geometry.attributes.position.array[i3 + 1] += 
              Math.sin(time + i * 0.1) * 0.01;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
        requestAnimationFrame(animate);
      };
      const animationId = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  return React.createElement(
    "points",
    { ref: particlesRef },
    [
      React.createElement(
        "bufferGeometry",
        null,
        React.createElement(
          "bufferAttribute",
          {
            attach: "attributes-position",
            count: count,
            array: positions,
            itemSize: 3
          }
        )
      ),
      React.createElement(
        "pointsMaterial",
        { 
          size: 0.05, 
          color: "#ffffff", 
          transparent: true, 
          opacity: 0.6 
        }
      )
    ]
  );
};

// Main splash screen component
const SplashScreen3D = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [skipIntro, setSkipIntro] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);
  
  useEffect(() => {
    if (progress >= 100 && !loading) {
      const timer = setTimeout(() => {
        if (!skipIntro) {
          onComplete();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, loading, onComplete, skipIntro]);
  
  const handleSkip = () => {
    setSkipIntro(true);
    onComplete();
  };
  
  return React.createElement(
    Box,
    {
      sx: {
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        bgcolor: '#050A18',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }
    },
    [
      React.createElement(
        Box, 
        { 
          key: "canvas-container",
          sx: { width: '100%', height: '70%', position: 'relative' } 
        },
        React.createElement(
          Canvas,
          {},
          [
            React.createElement(PerspectiveCamera, { 
              key: "camera",
              makeDefault: true, 
              position: [0, 0, 5], 
              fov: 60 
            }),
            React.createElement("ambientLight", { 
              key: "ambient-light",
              intensity: 0.2 
            }),
            React.createElement("spotLight", { 
              key: "spot-light",
              position: [10, 10, 10], 
              angle: 0.15, 
              penumbra: 1, 
              intensity: 1 
            }),
            React.createElement("pointLight", { 
              key: "point-light",
              position: [-10, -10, -10], 
              intensity: 0.5 
            }),
            React.createElement(Logo3D, { key: "logo" }),
            React.createElement(ParticleField, { key: "particles" }),
            React.createElement(TradingGraphs, { key: "graphs" }),
            React.createElement(Environment, { 
              key: "environment",
              preset: "city" 
            })
          ]
        )
      ),
      
      React.createElement(
        Typography,
        {
          key: "title",
          variant: "h5",
          sx: {
            mt: 3,
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.7 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.7 },
            },
          }
        },
        "Next-Gen Trading Platform"
      ),
      
      React.createElement(
        Box, 
        { 
          key: "progress-container",
          sx: { width: '300px', mt: 4, mb: 2, textAlign: 'center' } 
        },
        [
          loading 
            ? React.createElement(
                Typography, 
                { 
                  key: "loading-text",
                  variant: "body2", 
                  sx: { mb: 2 } 
                },
                "Loading platform capabilities..."
              )
            : React.createElement(
                Typography, 
                { 
                  key: "ready-text",
                  variant: "body2", 
                  sx: { mb: 2 } 
                },
                "Advanced trading environment ready"
              ),
          
          React.createElement(
            Box, 
            { 
              key: "progress-bar",
              sx: { position: 'relative', height: 20, width: '100%' } 
            },
            [
              React.createElement(
                Box,
                {
                  key: "progress-bg",
                  sx: {
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(25, 118, 210, 0.2)',
                    borderRadius: 1,
                  }
                }
              ),
              React.createElement(
                Box,
                {
                  key: "progress-fill",
                  sx: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    bgcolor: '#1976d2',
                    width: `${progress}%`,
                    borderRadius: 1,
                    transition: 'width 0.3s ease-in-out',
                  }
                }
              )
            ]
          )
        ]
      ),
      
      React.createElement(
        Button, 
        {
          key: "skip-button", 
          variant: "outlined", 
          onClick: handleSkip,
          sx: { mt: 4, color: 'white', borderColor: 'white' }
        },
        progress < 100 ? 'Skip Intro' : 'Enter Platform'
      )
    ]
  );
};

export default SplashScreen3D;
