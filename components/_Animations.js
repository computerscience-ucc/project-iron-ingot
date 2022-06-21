export const _Transition_Page = {
  initial: { opacity: 0, translateY: -20 },
  animate: {
    opacity: 1,
    translateY: 0,
    transition: { duration: 0.25, ease: 'circOut' },
  },
  exit: {
    opacity: 0,
    translateY: 20,
    transition: { duration: 0.25, ease: 'circIn' },
  },
};

export const _Transition_Card = {
  initial: { opacity: 0, translateY: -20 },
  animate: {
    opacity: 1,
    translateY: 0,
    transition: { duration: 0.25, ease: 'circOut', delay: 0.25 },
  },
};
