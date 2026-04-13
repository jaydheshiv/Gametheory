export const animationConfig = {
  ease: [0.16, 1, 0.3, 1],
  durationSm: 0.2,
  durationMd: 0.4,
  durationLg: 0.65,

  reveal: {
    distance: 18,
    blur: 7,
    once: true,
    margin: '-10% 0px -10% 0px',
  },

  parallax: {
    // Keep subtle for performance.
    maxTranslateY: 22,
  },

  magnetic: {
    // px
    strength: 14,
    radius: 120,
  },

  cursor: {
    enabled: true,
    lag: 0.12,
  },

  intro: {
    enabled: false,
    durationMs: 520,
  },
};
