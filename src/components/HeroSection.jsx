import React, { Suspense, lazy } from 'react';
import { animationConfig } from '../animations/config';
import { usePerfTier } from '../animations/usePerfTier';
import AnimatedHeadline from './AnimatedHeadline';

const HeroCanvas = lazy(() => import('./HeroCanvas'));

export default function HeroSection({
  kpiStrip,
  rightSlot,
}) {
  const { allow3D } = usePerfTier();

  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 glass-pane p-8 md:p-10">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-[90px] bg-[color:var(--secondary)] opacity-[0.14]" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full blur-[110px] bg-[color:var(--primary)] opacity-[0.12]" />
        <div className="hero-grain" />
      </div>

      {/* WebGL canvas */}
      {allow3D && (
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.26em] text-white/70 mb-4" data-reveal>
              Futuristic Logistics Control System
            </div>
            <AnimatedHeadline
              title="Logistics Command"
              subtitle="A cinematic supply-chain strategy simulator with game-theory intelligence, real-time risk signals, and tactical decisioning."
            />
          </div>
          {rightSlot && (
            <div className="hidden md:block" data-reveal>
              {rightSlot}
            </div>
          )}
        </div>

        {kpiStrip && (
          <div className="mt-8" data-reveal>
            {kpiStrip}
          </div>
        )}

        {/* subtle motion hint */}
        <div
          className="mt-6 text-xs text-white/45 font-mono tracking-wide"
          style={{ opacity: animationConfig.parallax.maxTranslateY ? 1 : 1 }}
          data-reveal
        >
          Scroll to engage systems • Hover to inspect • Click to deploy
        </div>
      </div>
    </header>
  );
}
