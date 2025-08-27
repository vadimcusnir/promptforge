declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export {};
