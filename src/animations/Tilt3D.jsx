import React, { useEffect, useRef } from 'react';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function Tilt3D({
  children,
  className,
  maxTilt = 9,
  scale = 1.02,
  glare = false,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotionPref();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (isCoarsePointer) return;

    let hovering = false;

    const onMove = (e) => {
      if (!hovering) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * (maxTilt * 2);
      const rotateX = -(py - 0.5) * (maxTilt * 2);

      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

      if (glare) {
        el.style.setProperty('--tilt-glare-x', `${px * 100}%`);
        el.style.setProperty('--tilt-glare-y', `${py * 100}%`);
      }
    };

    const onEnter = () => {
      hovering = true;
      el.style.willChange = 'transform';
    };

    const onLeave = () => {
      hovering = false;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.willChange = 'auto';
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointermove', onMove);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointermove', onMove);
    };
  }, [glare, maxTilt, reducedMotion, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
