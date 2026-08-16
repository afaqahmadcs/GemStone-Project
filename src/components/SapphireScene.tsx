import { useImperativeHandle, forwardRef } from 'react';
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

const SapphireScene = forwardRef<SapphireSceneController, SapphireSceneProps>((_, ref) => {
  
  // Keep empty imperative handles so parent GSAP scrubs do not crash
  useImperativeHandle(ref, () => ({
    setRotation() {},
    setPosition() {},
    setScale() {},
    setLightIntensity() {},
    setCameraDistance() {}
  }));

  return (
    <div className="sapphire-visual-container media-mode" style={{ width: '100%', height: '100%' }}>
      <video
        src="/Videos/hero-sapphire-animation.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="hero-video-player"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
});

SapphireScene.displayName = 'SapphireScene';

export default SapphireScene;
