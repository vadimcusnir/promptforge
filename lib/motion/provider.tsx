// Motion provider for animations
import { createContext, useContext, ReactNode } from 'react';

export interface MotionConfig {
  reducedMotion: boolean;
  enableAnimations: boolean;
}

const MotionContext = createContext<MotionConfig>({
  reducedMotion: false,
  enableAnimations: true,
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const config: MotionConfig = {
    reducedMotion: false,
    enableAnimations: true,
  };
  
  return (
    <MotionContext.Provider value={config}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion(): MotionConfig {
  return useContext(MotionContext);
}
