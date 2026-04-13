import React, { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { animationConfig } from './config';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  once = animationConfig.reveal.once,
  margin = animationConfig.reveal.margin,
  distance = animationConfig.reveal.distance,
}) {
  const blurPx = typeof animationConfig.reveal.blur === 'number' ? animationConfig.reveal.blur : 0;
  const reduceMotion = useReducedMotionPref();
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin });

  const Comp = useMemo(() => motion[as] || motion.div, [as]);

  return (
    <Comp
      ref={ref}
      className={className}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: distance, filter: `blur(${blurPx}px)` }
      }
      animate={
        reduceMotion
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : inView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : undefined
      }
      transition={{
        duration: animationConfig.durationMd,
        ease: animationConfig.ease,
        delay,
      }}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </Comp>
  );
}
