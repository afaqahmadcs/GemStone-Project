import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initImageReveals, refreshImageReveals } from '../utils/imageReveal';
import { REVEAL_DELAY_MS } from '../hooks/usePageTransition';

function killImageRevealTriggers(): void {
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars?.id === 'image-reveal') st.kill();
  });
}

export default function ImageRevealInit() {
  const location = useLocation();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const setup = () => {
      if (cancelled) return;

      cleanupRef.current?.();
      cleanupRef.current = null;
      killImageRevealTriggers();

      const main = document.querySelector('main');
      cleanupRef.current = initImageReveals(main ?? document);
      refreshImageReveals();
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // No enter animation — init immediately
      setup();
    } else {
      // Wait for the enter animation to complete before scanning for reveals
      timer = window.setTimeout(setup, REVEAL_DELAY_MS);
    }

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [location.pathname]);

  return null;
}
