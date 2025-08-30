// Background data for animations
export interface ActiveToken {
  id: string;
  x: number;
  y: number;
  speed: number;
  jitter: number;
  opacityRange: [number, number];
  weight: number;
  text: string;
}

export interface ActiveQuote {
  id: string;
  text: string;
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  preDelay: number;
  hold: number;
  out: number;
  cooldown: number;
  style: 'normal' | 'glitch';
  currentChar: number;
}

export const backgroundQuotes = [
  "The future is already here",
  "Code is poetry",
  "Simplicity is the ultimate sophistication",
  "Innovation distinguishes between a leader and a follower"
];
