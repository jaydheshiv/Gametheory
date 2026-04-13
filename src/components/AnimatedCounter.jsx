import React, { useEffect } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';
import { useReducedMotionPref } from '../animations/useReducedMotionPref';

export default function AnimatedCounter({
  value,
  format,
  duration = 0.9,
  className,
}) {
  const reducedMotion = useReducedMotionPref();
  const mv = useMotionValue(0);

  useEffect(() => {
    if (typeof value !== 'number' || Number.isNaN(value)) return;
    if (reducedMotion) {
      mv.set(value);
      return;
    }

    const controls = animate(mv, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [duration, mv, reducedMotion, value]);

  const text = useTransform(mv, (latest) => {
    const n = Math.round(latest);
    return typeof format === 'function' ? format(n) : String(n);
  });

  return (
    <motion.span className={className}>{text}</motion.span>
  );
}
