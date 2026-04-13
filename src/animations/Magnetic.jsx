import React, { useEffect, useRef } from 'react';
import { animationConfig } from './config';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function Magnetic({
  children,
  className,
  strength = animationConfig.magnetic.strength,
  radius = animationConfig.magnetic.radius,
  as: Comp = 'div',
  disabled = false,
}) {
  const reducedMotion = useReducedMotionPref();
  const elRef = useRef(null);
  const rafRef = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (disabled || reducedMotion) return;

    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (isCoarsePointer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      if (!activeRef.current) return;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const clamped = Math.min(dist, radius);
      const factor = 1 - clamped / radius;
      targetX = (dx / radius) * strength * factor;
      targetY = (dy / radius) * strength * factor;
    };

    const onPointerEnter = () => {
      activeRef.current = true;
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const onPointerLeave = () => {
      activeRef.current = false;
      targetX = 0;
      targetY = 0;
      el.style.transform = '';
      window.cancelAnimationFrame(rafRef.current);
    };

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.style.transform = '';
    };
  }, [disabled, reducedMotion, radius, strength]);

  return (
    <Comp ref={elRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </Comp>
  );
}
