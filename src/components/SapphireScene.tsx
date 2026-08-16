import { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import * as THREE from 'three';
import './SapphireScene.css';

export interface SapphireSceneController {
  setRotation: (x: number, y: number, z: number) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setScale: (s: number) => void;
  setLightIntensity: (intensity: number) => void;
  setCameraDistance: (z: number) => void;
}

interface SapphireSceneProps {
  mode?: '3d' | 'media';
}

const SapphireScene = forwardRef<SapphireSceneController, SapphireSceneProps>(({ mode = '3d' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Keep mutable references to Three.js objects for direct manipulation
  const gemstoneRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // For mouse interaction
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Expose controller methods to parent component (e.g., GSAP timeline triggers)
  useImperativeHandle(ref, () => ({
    setRotation(x, y, z) {
      if (gemstoneRef.current) {
        gemstoneRef.current.rotation.set(x, y, z);
      }
    },
    setPosition(x, y, z) {
      if (gemstoneRef.current) {
        gemstoneRef.current.position.set(x, y, z);
      }
    },
    setScale(s) {
      if (gemstoneRef.current) {
        // Maintain the flattened cushion-cut ratio while scaling
        gemstoneRef.current.scale.set(s, s * 0.7, s);
      }
    },
    setLightIntensity(intensity) {
      if (keyLightRef.current) {
        keyLightRef.current.intensity = intensity;
      }
    },
    setCameraDistance(z) {
      if (cameraRef.current) {
        cameraRef.current.position.z = z;
      }
    }
  }));

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Custom faceted gemstone geometry (Icosahedron scaled for cushion-cut)
    // Detail level 1 creates a beautiful 80-faceted polyhedron
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    // 5. Luxury material setup simulating deep sapphire blue
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0A2647'),      // Premium Deep Royal Sapphire Blue
      roughness: 0.03,                       // High polish
      metalness: 0.05,
      transmission: 0.95,                     // High transmission for gemstone refraction
      ior: 1.77,                             // Actual Index of Refraction for Sapphire (1.76-1.77)
      thickness: 2.0,                        // Material thickness for internal refraction
      clearcoat: 1.0,                        // Premium outer coating
      clearcoatRoughness: 0.02,
      flatShading: true,                     // Sharp faceted flat face rendering (Catches highlights)
      side: THREE.DoubleSide,                // Render back-faces inside refraction
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#ffffff'),
    });

    const gemstone = new THREE.Mesh(geometry, material);
    // Flatten gemstone slightly along the Y-axis to emulate a master-cut cushion sapphire
    gemstone.scale.set(1, 0.7, 1);
    scene.add(gemstone);
    gemstoneRef.current = gemstone;

    // 6. Luxury studio lighting rig
    const ambientLight = new THREE.AmbientLight('#020617', 0.8);
    scene.add(ambientLight);

    // Warm Key Light (Main highlight)
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.0);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Cool Rim Light (Vibrant sapphire contour highlight)
    const rimLight = new THREE.DirectionalLight('#1e40af', 3.5);
    rimLight.position.set(-5, -5, -2);
    scene.add(rimLight);

    // Sparkling Fill Light (Front fill)
    const fillLight = new THREE.DirectionalLight('#e0f2fe', 1.0);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    // 7. Render Loop & Idle floating movement
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isSceneVisible = true;

    let observer: IntersectionObserver | null = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isSceneVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isSceneVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax translation interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Soft base floating motion & elegant continuous rotation
      if (gemstone) {
        // Slow continuous rotation (1 full rotation every 15 seconds) + mouse offset
        gemstone.rotation.y = elapsedTime * (2 * Math.PI / 15) + mouse.x * 0.5;
        // Subtle mouse parallax tilt offset on the X-axis
        gemstone.rotation.x = mouse.y * 0.3;
        
        // Gentle vertical float
        gemstone.position.y = Math.sin(elapsedTime * 0.8) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Event Handlers (Resize and Mouse Tracking)
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate scale between -0.5 and 0.5
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 9. Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mode]);

  // Render pre-rendered media loop fallback or WebGL 3D Canvas
  if (mode === 'media') {
    return (
      <div className="sapphire-visual-container media-mode" ref={containerRef}>
        <div className="gemstone-static-fallback">
          <svg viewBox="0 0 100 100" className="gemstone-vector" aria-hidden="true">
            <polygon points="50,15 75,30 75,70 50,85 25,70 25,30" className="gem-outline" />
            <polygon points="50,15 50,85" className="gem-facet-line" />
            <polygon points="25,30 75,30" className="gem-facet-line" />
            <polygon points="25,70 75,70" className="gem-facet-line" />
            <polygon points="25,30 50,50 75,30" className="gem-facet-line" />
            <polygon points="25,70 50,50 75,70" className="gem-facet-line" />
          </svg>
          <span className="media-placeholder-label">BLUE SAPPHIRE MAISON</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sapphire-visual-container webgl-mode" ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} className="sapphire-canvas" aria-label="Interactive 3D Sapphire Crystal" style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
});

SapphireScene.displayName = 'SapphireScene';

export default SapphireScene;
