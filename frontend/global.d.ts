declare module 'canvas-confetti';
declare module 'lottie-react';
declare module 'react-markdown';
declare module 'remark-gfm';
declare module 'recharts';
declare module 'firebase/app';
declare module 'firebase/auth';
declare module 'firebase/firestore';
declare module 'firebase/app-check';
declare module 'firebase/storage';
declare module 'firebase/analytics';

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean | string;
      'camera-controls'?: boolean | string;
      'disable-zoom'?: boolean | string;
      'auto-rotate-delay'?: string | number;
      'interaction-prompt'?: string;
      exposure?: string | number;
      'shadow-intensity'?: string | number;
      'shadow-softness'?: string | number;
      'environment-image'?: string;
      'camera-orbit'?: string;
      'rotation-speed'?: string | number;
      loading?: 'auto' | 'lazy' | 'eager';
      poster?: string;
    };
  }
}
