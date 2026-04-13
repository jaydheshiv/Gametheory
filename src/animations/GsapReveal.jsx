import React, { useLayoutEffect, useRef } from 'react';
import { animationConfig } from './config';
import { ensureGsapRegistered, gsap, ScrollTrigger } from './gsap';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function GsapReveal({
  children,
  className,
  y = animationConfig.reveal.distance,
  blur = animationConfig.reveal.blur,
  start = 'top 80%',
  once = true,
  stagger = 0.06,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotionPref();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (!ref.current) return;

    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const el = ref.current;
      const targets = el.querySelectorAll('[data-reveal]');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          once,
        },
      });

      if (targets.length) {
        tl.fromTo(
          targets,
          { opacity: 0, y, filter: `blur(${blur}px)` },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: animationConfig.durationMd,
            ease: animationConfig.ease,
            stagger,
            clearProps: 'transform,filter',
          }
        );
      } else {
        tl.fromTo(
          el,
          { opacity: 0, y, filter: `blur(${blur}px)` },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: animationConfig.durationMd,
            ease: animationConfig.ease,
            clearProps: 'transform,filter',
          }
        );
      }
    }, ref);

    // Refresh in case Lenis is active.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [blur, once, reducedMotion, stagger, start, y]);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
