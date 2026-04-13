import React, { useEffect, useRef } from 'react';
import { animationConfig } from './config';
import { useReducedMotionPref } from './useReducedMotionPref';

export default function CursorFollower({ enabled = animationConfig.cursor.enabled }) {
  const reducedMotion = useReducedMotionPref();
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    if (typeof window === 'undefined') return;

    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (isCoarsePointer) return;

    const dot = dotRef.current;
    const halo = haloRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !halo || !ring || !label) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let hx = mx;
    let hy = my;

    let hoveringInteractive = false;
    let pressing = false;
    let cursorLabel = '';
    let dotScale = 1;
    let haloScale = 1;
    let dotOpacity = 1;
    let haloOpacity = 1;
    let labelOpacity = 0;

    let ripple = 0;

    const isInteractive = (el) => {
      if (!el) return false;
      const interactive = el.closest?.('button, a, input, select, textarea, [role="button"], [data-cursor]');
      if (!interactive) return false;

      if (interactive.hasAttribute?.('disabled')) return false;
      if (interactive.getAttribute?.('aria-disabled') === 'true') return false;
      return true;
    };

    const getCursorLabel = (el) => {
      const interactive = el?.closest?.('button, a, input, select, textarea, [role="button"], [data-cursor]');
      if (!interactive) return '';

      const explicit = interactive.getAttribute?.('data-cursor-label');
      if (explicit) return explicit;

      const tag = interactive.tagName?.toLowerCase?.();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'Edit';
      return 'Select';
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onPointerOver = (e) => {
      hoveringInteractive = isInteractive(e.target);
      cursorLabel = hoveringInteractive ? getCursorLabel(e.target) : '';
    };

    const onPointerOut = () => {
      hoveringInteractive = false;
      pressing = false;
      cursorLabel = '';
    };

    const onPointerDown = () => {
      pressing = true;
      ripple = 1;
    };

    const onPointerUp = () => {
      pressing = false;
    };

    let rafId = 0;
    const tick = () => {
      const lag = animationConfig.cursor.lag;
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      hx += (mx - hx) * lag;
      hy += (my - hy) * lag;

      const targetHaloScale = pressing ? 0.92 : hoveringInteractive ? 1.4 : 1;
      const targetDotScale = pressing ? 0.88 : hoveringInteractive ? 1.15 : 1;
      const targetHaloOpacity = hoveringInteractive ? 1 : 0.85;
      const targetDotOpacity = hoveringInteractive ? 0.95 : 0.75;
      const targetLabelOpacity = hoveringInteractive && cursorLabel ? 1 : 0;

      haloScale += (targetHaloScale - haloScale) * 0.18;
      dotScale += (targetDotScale - dotScale) * 0.25;
      haloOpacity += (targetHaloOpacity - haloOpacity) * 0.14;
      dotOpacity += (targetDotOpacity - dotOpacity) * 0.18;
      labelOpacity += (targetLabelOpacity - labelOpacity) * 0.18;

      ripple *= 0.86;

      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${dotScale})`;
      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) scale(${haloScale})`;
      dot.style.opacity = String(dotOpacity);
      halo.style.opacity = String(haloOpacity);

      ring.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${1 + (1 - ripple) * 1.8})`;
      ring.style.opacity = String(Math.max(0, ripple - 0.08));

      label.textContent = cursorLabel;
      label.style.transform = `translate3d(${hx + 18}px, ${hy + 18}px, 0)`;
      label.style.opacity = String(labelOpacity);

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true, capture: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true, capture: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerover', onPointerOver, { capture: true });
      window.removeEventListener('pointerout', onPointerOut, { capture: true });
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div ref={haloRef} className="cursor-halo" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
