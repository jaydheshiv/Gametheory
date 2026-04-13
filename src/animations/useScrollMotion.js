import { useEffect } from 'react';
import { ensureGsapRegistered, ScrollTrigger } from './gsap';

/**
 * Bridges Lenis smooth scrolling with GSAP ScrollTrigger.
 * Call this once near the app root after Lenis is initialized.
 */
export function useScrollMotionBridge({ lenisRef, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    if (!lenisRef?.current) return;
    if (typeof window === 'undefined') return;

    ensureGsapRegistered();

    const lenis = lenisRef.current;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', onLenisScroll);

    ScrollTrigger.refresh();

    return () => {
      try {
        lenis.off('scroll', onLenisScroll);
      } catch {
        // ignore
      }
    };
  }, [enabled, lenisRef]);
}
