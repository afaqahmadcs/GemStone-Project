import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Durations must match the CSS keyframe durations in index.css
export const EXIT_MS  = 260;   // page-exit animation duration
export const ENTER_MS = 500;   // page-enter animation duration

// The delay ImageRevealInit waits before scanning for .image-reveal elements.
// Must be >= ENTER_MS so reveals fire after the new page is fully opaque.
export const REVEAL_DELAY_MS = ENTER_MS + 80;

type TransitionPhase = 'idle' | 'exiting' | 'entering';

interface PageTransitionState {
  /** Phase of the current transition */
  phase: TransitionPhase;
  /** The pathname that is visually rendered right now */
  displayedPath: string;
}

/**
 * Manages the exit → enter transition lifecycle.
 *
 * Returns:
 *  - phase          — current animation phase ('idle' | 'exiting' | 'entering')
 *  - displayedPath  — the path whose content is currently on screen
 *
 * How it works:
 *  1. React Router updates location.pathname immediately on navigation.
 *  2. We delay updating displayedPath by EXIT_MS to let the exit animation play.
 *  3. When displayedPath catches up to location.pathname the new page mounts
 *     with the enter animation.
 *  4. Scroll-to-top fires at the moment we switch displayedPath (push navigations
 *     only — popstate/back-forward is left to the browser).
 */
export function usePageTransition(): PageTransitionState {
  const location  = useLocation();
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPopRef  = useRef(false);

  const [state, setState] = useState<PageTransitionState>({
    phase: 'idle',
    displayedPath: location.pathname,
  });

  // Track whether the navigation is a popstate (back/forward)
  useEffect(() => {
    const onPop = () => { isPopRef.current = true; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const target = location.pathname;

    // Already showing this page — nothing to do
    if (state.displayedPath === target) {
      isPopRef.current = false;
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Collapse animation — switch immediately
      if (!isPopRef.current) window.scrollTo({ top: 0, behavior: 'instant' });
      isPopRef.current = false;
      setState({ phase: 'idle', displayedPath: target });
      return;
    }

    // Start exit phase
    setState((prev) => ({ ...prev, phase: 'exiting' }));

    timerRef.current = setTimeout(() => {
      // Scroll to top for push navigations only
      if (!isPopRef.current) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      isPopRef.current = false;

      // Switch content — triggers enter animation
      setState({ phase: 'entering', displayedPath: target });

      // After enter completes, return to idle
      timerRef.current = setTimeout(() => {
        setState({ phase: 'idle', displayedPath: target });
      }, ENTER_MS);
    }, EXIT_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return state;
}
