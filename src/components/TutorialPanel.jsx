import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, ArrowRight, X, Sparkles } from 'lucide-react';

const TutorialPanel = ({ isOpen, onClose, steps = [], stepIndex = 0, onNext, onPrev, onJump }) => {
  const safeIndex = Math.max(0, Math.min(steps.length - 1, stepIndex));
  const step = steps[safeIndex];
  const progress = useMemo(() => {
    if (!steps.length) return 0;
    return Math.round(((safeIndex + 1) / steps.length) * 100);
  }, [safeIndex, steps.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 text-white"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            className="glass-pane max-w-2xl w-full p-10 relative border-emerald-500/20"
          >
            <button type="button" aria-label="Close tutorial" onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X />
            </button>

            <div className="flex items-start justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/15">
                  <BookOpen className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black">How to Play</h2>
                  <p className="text-slate-400 text-sm">Step {safeIndex + 1} of {Math.max(steps.length, 1)} • {progress}%</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <Sparkles size={14} /> Guided highlights are enabled
              </div>
            </div>

            <div className="mb-6">
              <div className="progress-bar-container" style={{ margin: 0 }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {steps.slice(0, 6).map((s, idx) => (
                <button
                  type="button"
                  key={s.id || idx}
                  onClick={() => typeof onJump === 'function' && onJump(idx)}
                  className={`text-left rounded-2xl border px-4 py-3 transition-colors ${idx === safeIndex ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 bg-black/20 hover:bg-white/5'}`}
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">Step {idx + 1}</div>
                  <div className="text-sm font-bold text-slate-200 leading-snug mt-1">{s.title}</div>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step?.id || safeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800"
              >
                <h3 className="text-2xl font-black mb-2">{step?.title || 'Getting Started'}</h3>
                <p className="text-slate-300 leading-relaxed">
                  {step?.body || 'Use the steps to learn the flow, then start deploying strategies.'}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={typeof onPrev === 'function' ? onPrev : undefined}
                disabled={safeIndex === 0}
                className="btn-secondary flex items-center gap-2 px-5 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} /> Back
              </button>

              {safeIndex >= steps.length - 1 ? (
                <button type="button" onClick={onClose} className="btn-primary flex items-center gap-2 px-6 py-3">
                  Start Playing <ArrowRight size={18} />
                </button>
              ) : (
                <button type="button" onClick={typeof onNext === 'function' ? onNext : undefined} className="btn-primary flex items-center gap-2 px-6 py-3">
                  Next <ArrowRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialPanel;
