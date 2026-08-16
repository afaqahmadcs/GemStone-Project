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
  // Only trust explicit data-theme / class — do NOT fall back to system preference
  // because that would override the user's chosen site theme.
  return (
    document.body.classList.contains('light-theme') ||
    document.documentElement.classList.contains('light-theme') ||
    document.documentElement.getAttribute('data-theme') === 'light'
  );
}

function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

/**
 * Build a simple procedural cube-map environment that gives the gemstone
 * surfaces something to reflect — this is what makes faceted glass/crystal
 * look coloured rather than black.  We paint 6 canvas faces with gradients
 * that represent a studio lighting environment.
 */
function buildStudioEnvMap(
  renderer: THREE.WebGLRenderer,
  isDark: boolean
): THREE.Texture {
  const size = 128;
  const faces: ImageData[] = [];

  // Colours: dark studio vs light studio
  const topCol    = isDark ? [10,  20,  60]  : [210, 225, 255];
  const sideCol   = isDark ? [5,   15,  45]  : [180, 200, 240];
  const bottomCol = isDark ? [2,   5,   18]  : [140, 160, 200];
  const brightCol = isDark ? [40,  90,  220] : [120, 160, 255];

  for (let f = 0; f < 6; f++) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Each face gets a slightly different gradient to simulate studio lighting
    let col: number[];
    if (f === 2) col = topCol;      // +Y top — sky/key light
    else if (f === 3) col = bottomCol; // -Y bottom — floor bounce
    else if (f === 4) col = brightCol; // +Z front — main studio bright panel
    else col = sideCol;              // sides

    const grad = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size * 0.7
    );
    const bright = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 1)`;
    const mid    = `rgba(${Math.round(col[0]*0.5)}, ${Math.round(col[1]*0.5)}, ${Math.round(col[2]*0.5)}, 1)`;
    grad.addColorStop(0, bright);
    grad.addColorStop(1, mid);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    faces.push(ctx.getImageData(0, 0, size, size));
  }

  // Build CubeTexture from the 6 canvases
  const canvasList: HTMLCanvasElement[] = [];
  for (let f = 0; f < 6; f++) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    c.getContext('2d')!.putImageData(faces[f], 0, 0);
    canvasList.push(c);
  }

  const cubeTexture = new THREE.CubeTexture(canvasList as unknown as HTMLImageElement[]);
  cubeTexture.needsUpdate = true;

  // Convert to PMREM so it works with MeshPhysicalMaterial
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileCubemapShader();
  const envMap = pmrem.fromCubemap(cubeTexture).texture;
  pmrem.dispose();
  cubeTexture.dispose();
  return envMap;
}

const SapphireScene = forwardRef<SapphireSceneController, SapphireSceneProps>(({ mode = '3d' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gemstoneRef    = useRef<THREE.Mesh | null>(null);
  const keyLightRef    = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef    = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const cameraRef      = useRef<THREE.PerspectiveCamera | null>(null);
  const baseRotationY  = useRef(0);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useImperativeHandle(ref, () => ({
    setRotation(x, y, z) {
      if (gemstoneRef.current) gemstoneRef.current.rotation.set(x, y, z);
    },
    setPosition(x, y, z) {
      if (gemstoneRef.current) gemstoneRef.current.position.set(x, y, z);
    },
    setScale(s) {
      if (gemstoneRef.current) gemstoneRef.current.scale.set(s, s * 0.72, s);
    },
    setLightIntensity(intensity) {
      if (keyLightRef.current) keyLightRef.current.intensity = intensity;
    },
    setCameraDistance(z) {
      if (cameraRef.current) cameraRef.current.position.z = z;
    },
  }));

  useEffect(() => {
    if (mode !== '3d' || !containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const width  = container.clientWidth;
    const height = container.clientHeight;
    const mobile = isMobileViewport();
    const maxPixelRatio = mobile ? 1.5 : 2;

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? 'default' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    // Use LinearToneMapping at exposure 1 as a neutral baseline — ACES was
    // compressing the blue channel and making the gem appear darker/desaturated.
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Ensure correct colour output
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ─── Scene ───────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ─── Camera ──────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, mobile ? 8.5 : 7.2);
    cameraRef.current = camera;

    // ─── Procedural environment map ──────────────────────────────────────────
    // Having an envMap is the single most important thing for making a faceted
    // crystal/glass gem look coloured rather than black.
    let currentEnvMap: THREE.Texture = buildStudioEnvMap(renderer, !isLightTheme());
    scene.environment = currentEnvMap;

    // ─── Geometry ────────────────────────────────────────────────────────────
    const geometryDetail = mobile ? 1 : 2;
    const geometry = new THREE.IcosahedronGeometry(1.65, geometryDetail);

    // ─── Material ────────────────────────────────────────────────────────────
    // Key decisions:
    // • transmission: 0  — removes the "glass absorbs everything" black effect
    //   when there is no background to transmit. We simulate gem depth through
    //   the env map reflections instead.
    // • metalness: 0.08  — low metalness so env reflections appear without
    //   killing the diffuse blue body colour.
    // • roughness: 0.05  — low but not zero, keeps facet edges sharp.
    // • envMapIntensity: 1.8 — enough reflection to show facet planes clearly.
    // • flatShading: true — preserves the premium faceted cut appearance.
    const material = new THREE.MeshPhysicalMaterial({
      color:            new THREE.Color('#1a3d8f'),   // rich royal blue
      roughness:        0.05,
      metalness:        0.08,
      transmission:     0,                            // OFF — no black glass
      ior:              1.77,
      clearcoat:        1.0,
      clearcoatRoughness: 0.04,
      flatShading:      true,
      side:             THREE.DoubleSide,
      specularIntensity: 1.2,
      specularColor:    new THREE.Color('#a8c0ff'),   // blue-tinted specular
      envMapIntensity:  1.8,
      reflectivity:     0.9,
    });

    const gemstone = new THREE.Mesh(geometry, material);
    gemstone.scale.set(1, 0.72, 1);
    gemstone.castShadow = !mobile;
    gemstone.receiveShadow = false;
    scene.add(gemstone);
    gemstoneRef.current = gemstone;

    // ─── Lighting ────────────────────────────────────────────────────────────
    // All intensities are calibrated for LinearToneMapping at exposure 1.0.

    // Ambient — warm blue-tinted fill so unlit faces stay blue, not black
    const ambientLight = new THREE.AmbientLight('#1a3060', 1.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Key light — white overhead, creates bright facet highlights
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.0);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !mobile;
    if (!mobile) {
      keyLight.shadow.mapSize.set(512, 512);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far  = 20;
      keyLight.shadow.radius      = 4;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Rim light — blue from back-left, outlines the gem shape
    const rimLight = new THREE.DirectionalLight('#4488ff', 2.2);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Fill light — soft blue from front-left, lifts shadow areas
    const fillLight = new THREE.DirectionalLight('#93bbff', 1.4);
    fillLight.position.set(-2, 2, 4);
    scene.add(fillLight);

    // Accent point — subtle upward blue glow below gem
    const accentLight = new THREE.PointLight('#2255cc', 1.2, 10);
    accentLight.position.set(0, -1.5, 2);
    scene.add(accentLight);

    // ─── Pedestal shadow disc ─────────────────────────────────────────────────
    const pedestalGeometry = new THREE.CircleGeometry(2.2, 64);
    const pedestalMaterial = new THREE.MeshBasicMaterial({
      color:       0x0a1628,
      transparent: true,
      opacity:     0.35,
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.rotation.x = -Math.PI / 2;
    pedestal.position.y = -1.35;
    scene.add(pedestal);

    const shadowGeometry = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas   = document.createElement('canvas');
    shadowCanvas.width   = 128;
    shadowCanvas.height  = 128;
    const ctx            = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0,   'rgba(10, 25, 47, 0.45)');
      gradient.addColorStop(0.5, 'rgba(10, 25, 47, 0.12)');
      gradient.addColorStop(1,   'rgba(10, 25, 47, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture  = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map:        shadowTexture,
      transparent: true,
      depthWrite:  false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.34;
    scene.add(shadowPlane);

    // ─── Theme update ─────────────────────────────────────────────────────────
    const updateTheme = () => {
      const isLight = isLightTheme();

      // Rebuild environment map for the current theme
      const newEnvMap = buildStudioEnvMap(renderer, !isLight);
      scene.environment = newEnvMap;
      currentEnvMap.dispose();
      currentEnvMap = newEnvMap;

      if (isLight) {
        // ── Light Mode ──
        // Brighter, warmer ambient so gem reads against ivory background
        ambientLight.intensity = 2.4;
        ambientLight.color.set('#2244aa');

        keyLight.intensity  = 4.0;
        rimLight.intensity  = 1.2;
        rimLight.color.set('#6699ee');
        fillLight.intensity = 2.0;
        fillLight.color.set('#aabbff');

        // Slightly lighter, more vivid blue for light-bg contrast
        material.color.set('#1e4db7');
        material.envMapIntensity = 2.0;
        material.roughness = 0.05;

        pedestalMaterial.opacity = 0.10;
        pedestalMaterial.color.set(0xc8c0b4);

        renderer.toneMappingExposure = 1.0;

      } else {
        // ── Dark Mode ──
        // Ambient must stay blue-tinted — never near-black — so unlit faces
        // remain visibly blue rather than black
        ambientLight.intensity = 1.8;
        ambientLight.color.set('#1a3060');

        keyLight.intensity  = 3.0;
        rimLight.intensity  = 2.2;
        rimLight.color.set('#4488ff');
        fillLight.intensity = 1.4;
        fillLight.color.set('#93bbff');

        material.color.set('#1a3d8f');
        material.envMapIntensity = 1.8;
        material.roughness = 0.05;

        pedestalMaterial.opacity = 0.35;
        pedestalMaterial.color.set(0x0a1628);

        renderer.toneMappingExposure = 1.0;
      }
    };

    updateTheme();

    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // ─── Animation loop ───────────────────────────────────────────────────────
    let animationFrameId = 0;
    const clock = new THREE.Clock();
    let isSceneVisible = true;

    let intersectionObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => { isSceneVisible = entries[0]?.isIntersecting ?? true; },
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
        gemstone.rotation.y  = baseRotationY.current + mouse.x * 0.12;
        gemstone.rotation.x  = mouse.y * 0.06;
        gemstone.position.y  = Math.sin(elapsed * 0.7) * FLOAT_AMPLITUDE;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize & mouse ───────────────────────────────────────────────────────
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

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      intersectionObserver?.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      geometry.dispose();
      material.dispose();
      pedestalGeometry.dispose();
      pedestalMaterial.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
      currentEnvMap.dispose();
      renderer.dispose();
    };
  }, [mode]);

  // ─── Reduced-motion fallback ────────────────────────────────────────────────
  if (mode === 'media') {
    return (
      <div className="sapphire-visual-container media-mode" ref={containerRef}>
        <div className="gemstone-static-fallback">
          <div className="gemstone-fallback-glow" aria-hidden="true" />
          <svg viewBox="0 0 100 100" className="gemstone-vector" aria-hidden="true">
            <defs>
              <linearGradient id="sapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#3366cc" />
                <stop offset="50%"  stopColor="#1a3d8f" />
                <stop offset="100%" stopColor="#0e2560" />
              </linearGradient>
            </defs>
            <polygon points="50,12 78,28 78,72 50,88 22,72 22,28"
              fill="url(#sapphireGrad)" className="gem-outline" />
            <polygon points="50,12 50,88"    className="gem-facet-line" />
            <polygon points="22,28 78,28"    className="gem-facet-line" />
            <polygon points="22,72 78,72"    className="gem-facet-line" />
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
