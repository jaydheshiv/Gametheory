import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { animationConfig } from '../animations/config';
import { ensureGsapRegistered, gsap } from '../animations/gsap';
import { useReducedMotionPref } from '../animations/useReducedMotionPref';

export default function AnimatedHeadline({
  title,
  subtitle,
  className,
}) {
  const reducedMotion = useReducedMotionPref();
  const rootRef = useRef(null);

  const letters = useMemo(() => {
    const chars = Array.from(title);
    return chars.map((ch, idx) => ({ ch, idx }));
  }, [title]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (!rootRef.current) return;

    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: animationConfig.ease } });
      tl.fromTo(
        '[data-letter]',
        { y: 18, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: animationConfig.durationMd,
          stagger: 0.018,
          clearProps: 'transform,filter',
        }
      ).fromTo(
        '[data-subtitle]',
        { y: 10, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: animationConfig.durationSm,
          clearProps: 'transform,filter',
        },
        '-=0.15'
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={className}>
      <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.02]">
        {letters.map(({ ch, idx }) => (
          <span
            key={idx}
            data-letter
            className="inline-block"
            style={{ willChange: 'transform, opacity, filter' }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </h1>
      {subtitle && (
        <p data-subtitle className="mt-4 text-slate-300/80 text-sm md:text-base font-medium max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
