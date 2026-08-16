import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXCLUDED_ANCESTOR = '.story-container, .lightbox-backdrop, .sapphire-visual-container';
const STAGGER_CONTAINER =
  '.asymmetric-grid, .gallery-grid, .collection-catalog-grid, .staggered-visual-composition';

export function initImageReveals(root: ParentNode = document): () => void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = Array.from(root.querySelectorAll<HTMLElement>('.image-reveal')).filter(
    (el) => !el.closest(EXCLUDED_ANCESTOR) && !el.classList.contains('image-reveal-complete')
  );

  if (elements.length === 0) {
    return () => {};
  }

  if (prefersReduced) {
    elements.forEach((el) => {
      el.classList.remove('image-reveal-pending');
      el.classList.add('image-reveal-complete');
    });
    return () => {};
  }

  const scrollTriggers: ScrollTrigger[] = [];
  const timelines: gsap.core.Timeline[] = [];

  elements.forEach((el) => {
    const img = el.querySelector('img');
    if (!img || el.classList.contains('image-reveal-pending')) return;

    el.classList.add('image-reveal-pending');
    gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(img, { opacity: 0 });

    const grid = el.closest(STAGGER_CONTAINER);
    let staggerDelay = 0;
    if (grid) {
      const siblings = Array.from(grid.querySelectorAll<HTMLElement>('.image-reveal')).filter(
        (node) => !node.classList.contains('image-reveal-complete')
      );
      staggerDelay = siblings.indexOf(el) * 0.08;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'image-reveal',
        trigger: el,
        start: 'top 88%',
        once: true,
        invalidateOnRefresh: true,
      },
      delay: staggerDelay,
      onComplete: () => {
        el.classList.remove('image-reveal-pending');
        el.classList.add('image-reveal-complete');
        gsap.set(el, { clearProps: 'clipPath,willChange' });
        gsap.set(img, { clearProps: 'opacity' });
      },
    });

    tl.fromTo(
      el,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 1.35, ease: 'power3.inOut' },
      0
    );

    tl.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.12);

    timelines.push(tl);
    if (tl.scrollTrigger) scrollTriggers.push(tl.scrollTrigger);

    if (!img.complete) {
      img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
  });

  ScrollTrigger.refresh();

  return () => {
    timelines.forEach((tl) => tl.kill());
    scrollTriggers.forEach((st) => st.kill());
  };
}

export function refreshImageReveals(): void {
  ScrollTrigger.refresh();
}
