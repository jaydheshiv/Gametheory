import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotionPref } from './useReducedMotionPref';

export function useLenisSmoothScroll({ enabled = true } = {}) {
  const reducedMotion = useReducedMotionPref();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    if (typeof window === 'undefined') return;

    // Avoid on touch devices where native scroll is typically best.
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (isCoarsePointer) return;

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, reducedMotion]);

  return lenisRef;
}
