import background from '../../tokens/semantic/light/background';
import foreground from '../../tokens/semantic/light/foreground';
import border from '../../tokens/semantic/light/border';

export const focusRing = `
   0 0 0 2px ${foreground['fg-primary']},
   0 0 0 4px ${background['bg-brand-green']}
`;

export const focusRingError = `
  0 0 0 2px ${foreground['fg-primary']},
  0 0 0 4px ${background['bg-error']}
`;

export const skeuomorphicFocusRing = `
  inset 0 0 0 1px var(--trans-dark-20),
  inset 0 -2px 0  var(--trans-dark-5),
  0 1px 2px 0     var(--trans-dark-5),
  ${focusRing}
`;

export const skeuomorphicFocusRingError = `
  inset 0 0 0 1px var(--trans-dark-20),
  inset 0 -2px 0  var(--trans-dark-5),
  0 1px 2px 0     var(--trans-dark-5),
  ${focusRingError}
`;

export const focusRingOutlinedError = `
  inset 0 0 0 1px ${border['border-error']},
  inset 0 -2px 0  var(--trans-dark-5),
  0 1px 2px 0     var(--trans-dark-5),
  ${focusRingError}
`;
