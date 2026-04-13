import { useEffect, useMemo, useState } from 'react';
import { useReducedMotionPref } from './useReducedMotionPref';

export function usePerfTier() {
  const reducedMotion = useReducedMotionPref();
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia?.('(pointer: coarse)');
    const update = () => setCoarsePointer(Boolean(mq?.matches));
    update();

    if (mq?.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq?.addListener?.(update);
    return () => mq?.removeListener?.(update);
  }, []);

  const tier = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { lowEnd: true, allow3D: false };
    }

    const mem = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : 8;
    const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 8;

    const lowEnd = mem <= 3 || cores <= 4;
    const allow3D = !reducedMotion && !coarsePointer && !lowEnd;

    return { lowEnd, allow3D };
  }, [coarsePointer, reducedMotion]);

  return tier;
}
