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

const ROTATION_PERIOD = 15;
const FLOAT_AMPLITUDE = 0.06;

function isLightTheme(): boolean {
  const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isBodyLight =
    document.body.classList.contains('light-theme') ||
    document.documentElement.classList.contains('light-theme') ||
    document.documentElement.getAttribute('data-theme') === 'light';
  return isBodyLight || isSystemLight;
}

function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

const SapphireScene = forwardRef<SapphireSceneController, SapphireSceneProps>(({ mode = '3d' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gemstoneRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const baseRotationY = useRef(0);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
        gemstoneRef.current.scale.set(s, s * 0.72, s);
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
    },
  }));

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const mobile = isMobileViewport();
    const maxPixelRatio = mobile ? 1.5 : 2;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, mobile ? 8.5 : 7.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? 'default' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = mobile ? 0.95 : 1.05;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const geometryDetail = mobile ? 1 : 2;
    const geometry = new THREE.IcosahedronGeometry(1.65, geometryDetail);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0A2647'),
      roughness: 0.015,
      metalness: 0,
      transmission: 0.96,
      ior: 1.77,
      thickness: 2.8,
      clearcoat: 1,
      clearcoatRoughness: 0.008,
      flatShading: true,
      side: THREE.DoubleSide,
      specularIntensity: 1,
      specularColor: new THREE.Color('#ffffff'),
      attenuationColor: new THREE.Color('#1e3a8a'),
      attenuationDistance: 3.5,
    });

    const gemstone = new THREE.Mesh(geometry, material);
    gemstone.scale.set(1, 0.72, 1);
    gemstone.castShadow = !mobile;
    gemstone.receiveShadow = false;
    scene.add(gemstone);
    gemstoneRef.current = gemstone;

    const ambientLight = new THREE.AmbientLight('#020617', 0.75);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !mobile;
    if (!mobile) {
      keyLight.shadow.mapSize.set(512, 512);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.radius = 4;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight('#2563eb', 2.8);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight('#dbeafe', 0.85);
    fillLight.position.set(-2, 2, 4);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight('#1e40af', 0.6, 12);
    accentLight.position.set(0, -1.5, 2);
    scene.add(accentLight);

    const pedestalGeometry = new THREE.CircleGeometry(2.2, 64);
    const pedestalMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a1628,
      transparent: true,
      opacity: 0.35,
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.rotation.x = -Math.PI / 2;
    pedestal.position.y = -1.35;
    scene.add(pedestal);

    const shadowGeometry = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(10, 25, 47, 0.45)');
      gradient.addColorStop(0.5, 'rgba(10, 25, 47, 0.12)');
      gradient.addColorStop(1, 'rgba(10, 25, 47, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.34;
    scene.add(shadowPlane);

    const updateTheme = () => {
      const isLight = isLightTheme();
      ambientLight.intensity = isLight ? 1.4 : 0.75;
      ambientLight.color.set(isLight ? '#f0ede8' : '#020617');
      keyLight.intensity = isLight ? 2.8 : 2.2;
      rimLight.intensity = isLight ? 1.6 : 2.8;
      fillLight.intensity = isLight ? 1.1 : 0.85;
      material.color.set(isLight ? '#1e3a68' : '#0A2647');
      pedestalMaterial.opacity = isLight ? 0.2 : 0.35;
      pedestalMaterial.color.set(isLight ? 0xd4cfc7 : 0x0a1628);
      renderer.toneMappingExposure = isLight ? 1.15 : mobile ? 0.95 : 1.05;
    };

    updateTheme();

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    colorSchemeQuery.addEventListener('change', updateTheme);

    let animationFrameId = 0;
    const clock = new THREE.Clock();
    let isSceneVisible = true;

    let intersectionObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isSceneVisible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isSceneVisible) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const elapsed = prefersReduced ? 0 : clock.getElapsedTime();

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      if (gemstone) {
        if (!prefersReduced) {
          baseRotationY.current = elapsed * ((2 * Math.PI) / ROTATION_PERIOD);
        }
        gemstone.rotation.y = baseRotationY.current + mouse.x * 0.12;
        gemstone.rotation.x = mouse.y * 0.06;
        gemstone.position.y = Math.sin(elapsed * 0.7) * FLOAT_AMPLITUDE;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mobile) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      mouseRef.current.targetX = (relX - 0.5) * 0.6;
      mouseRef.current.targetY = (relY - 0.5) * 0.4;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      intersectionObserver?.disconnect();
      themeObserver.disconnect();
      colorSchemeQuery.removeEventListener('change', updateTheme);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      geometry.dispose();
      material.dispose();
      pedestalGeometry.dispose();
      pedestalMaterial.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, [mode]);

  if (mode === 'media') {
    return (
      <div className="sapphire-visual-container media-mode" ref={containerRef}>
        <div className="gemstone-static-fallback">
          <div className="gemstone-fallback-glow" aria-hidden="true" />
          <svg viewBox="0 0 100 100" className="gemstone-vector" aria-hidden="true">
            <defs>
              <linearGradient id="sapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#0A2647" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
            </defs>
            <polygon points="50,12 78,28 78,72 50,88 22,72 22,28" fill="url(#sapphireGrad)" className="gem-outline" />
            <polygon points="50,12 50,88" className="gem-facet-line" />
            <polygon points="22,28 78,28" className="gem-facet-line" />
            <polygon points="22,72 78,72" className="gem-facet-line" />
            <polygon points="22,28 50,50 78,28" className="gem-facet-line" />
            <polygon points="22,72 50,50 78,72" className="gem-facet-line" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="sapphire-visual-container webgl-mode" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="sapphire-canvas"
        aria-label="Interactive 3D blue sapphire gemstone"
      />
    </div>
  );
});

SapphireScene.displayName = 'SapphireScene';

export default SapphireScene;
