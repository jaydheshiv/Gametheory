import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { animationConfig } from './config';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function IntroOverlay({
  enabled = animationConfig.intro?.enabled ?? true,
  sessionKey = 'gt_intro_seen',
  durationMs = animationConfig.intro?.durationMs ?? 650,
}) {
  const reducedMotion = useReducedMotionPref();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (reducedMotion) return;
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem(sessionKey) === '1';
    if (seen) return;

    sessionStorage.setItem(sessionKey, '1');
    setShow(true);

    const t = window.setTimeout(() => setShow(false), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, reducedMotion, sessionKey]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: animationConfig.durationMd, ease: animationConfig.ease }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ duration: animationConfig.durationMd, ease: animationConfig.ease }}
            className="glass-pane px-10 py-8 text-center border-white/10"
          >
            <div className="text-xs font-black uppercase tracking-[0.25em] text-white/70 mb-3">
              Initializing Simulation
            </div>
            <div className="text-3xl font-black tracking-tight text-white mb-6">
              Logistics <span className="text-white">Command</span>
            </div>
            <div className="progress-bar-container" style={{ margin: 0 }}>
              <motion.div
                className="progress-bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: durationMs / 1000, ease: animationConfig.ease }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
