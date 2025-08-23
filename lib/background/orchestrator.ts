'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export type MotionLevel = 'full' | 'soft' | 'static';
export type LayerState = 'inactive' | 'initializing' | 'active' | 'paused' | 'error';

export interface LayerConfig {
  id: string;
  priority: number;
  enabled: boolean;
  state: LayerState;
  performanceBudget: {
    maxMemoryMB: number;
    maxCpuPercent: number;
    targetFPS: number;
  };
}

export interface OrchestrationContext {
  viewport: { width: number; height: number; visible: boolean };
  motion: MotionLevel;
  performance: {
    tier: 'hi' | 'mid' | 'low';
    cpuLoad: number;
    memoryUsage: number;
  };
  interaction: { tabActive: boolean; inputFocused: boolean; userIdle: boolean };
  timing: { startTime: number; currentTime: number };
}

export class BackgroundOrchestrator {
  private layers: Map<string, LayerConfig> = new Map();
  private context: OrchestrationContext;
  private observers: Map<string, (context: OrchestrationContext) => void> = new Map();
  private performanceMonitor: PerformanceObserver | null = null;
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  constructor() {
    this.context = {
      viewport: { width: 0, height: 0, visible: true },
      motion: 'full',
      performance: { tier: 'hi', cpuLoad: 0, memoryUsage: 0 },
      interaction: { tabActive: true, inputFocused: false, userIdle: false },
      timing: { startTime: Date.now(), currentTime: Date.now() },
    };

    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Viewport monitoring
    if (typeof window !== 'undefined') {
      const updateViewport = () => {
        this.context.viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          visible: !document.hidden,
        };
        this.notifyObservers();
      };

      window.addEventListener('resize', updateViewport);
      document.addEventListener('visibilitychange', updateViewport);
      updateViewport();

      // Tab activity monitoring
      const handleFocus = () => {
        this.context.interaction.tabActive = true;
        this.notifyObservers();
      };
      const handleBlur = () => {
        this.context.interaction.tabActive = false;
        this.notifyObservers();
      };

      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);

      // Input focus monitoring
      const handleInputFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        this.context.interaction.inputFocused =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true';
        this.notifyObservers();
      };

      document.addEventListener('focusin', handleInputFocus);
      document.addEventListener('focusout', handleInputFocus);

      // Reduced motion detection
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const updateMotion = () => {
        this.context.motion = mediaQuery.matches ? 'static' : 'full';
        this.notifyObservers();
      };
      mediaQuery.addEventListener('change', updateMotion);
      updateMotion();

      // Performance monitoring
      if ('PerformanceObserver' in window) {
        this.performanceMonitor = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure') {
              // Update performance metrics
              this.updatePerformanceMetrics();
            }
          });
        });
        this.performanceMonitor.observe({
          entryTypes: ['measure', 'navigation'],
        });
      }
    }
  }

  private updatePerformanceMetrics() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        this.context.performance.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // Simple FPS estimation
      let lastTime = 0;
      let frameCount = 0;
      const measureFPS = (currentTime: number) => {
        frameCount++;
        if (currentTime - lastTime >= 1000) {
          const fps = frameCount;
          this.context.performance.tier = fps >= 50 ? 'hi' : fps >= 30 ? 'mid' : 'low';
          frameCount = 0;
          lastTime = currentTime;
        }
        requestAnimationFrame(measureFPS);
      };
      requestAnimationFrame(measureFPS);
    }
  }

  registerLayer(config: LayerConfig): void {
    this.layers.set(config.id, { ...config, state: 'inactive' });
    this.retryAttempts.set(config.id, 0);
  }

  startLayer(layerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const layer = this.layers.get(layerId);
      if (!layer) {
        reject(new Error(`Layer ${layerId} not found`));
        return;
      }

      if (!this.shouldLayerBeActive(layer)) {
        resolve();
        return;
      }

      layer.state = 'initializing';
      this.layers.set(layerId, layer);

      // Progressive initialization with delays
      const delays = [0, 100, 300];
      const attemptCount = this.retryAttempts.get(layerId) || 0;

      if (attemptCount >= this.maxRetries) {
        layer.state = 'error';
        this.layers.set(layerId, layer);
        reject(new Error(`Layer ${layerId} failed after ${this.maxRetries} attempts`));
        return;
      }

      setTimeout(
        () => {
          try {
            layer.state = 'active';
            this.layers.set(layerId, layer);
            this.retryAttempts.set(layerId, 0);
            resolve();
          } catch (error) {
            this.retryAttempts.set(layerId, attemptCount + 1);
            this.startLayer(layerId).then(resolve).catch(reject);
          }
        },
        delays[Math.min(attemptCount, delays.length - 1)]
      );
    });
  }

  stopLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.state = 'inactive';
      this.layers.set(layerId, layer);
    }
  }

  pauseLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer && layer.state === 'active') {
      layer.state = 'paused';
      this.layers.set(layerId, layer);
    }
  }

  resumeLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer && layer.state === 'paused') {
      layer.state = 'active';
      this.layers.set(layerId, layer);
    }
  }

  private shouldLayerBeActive(layer: LayerConfig): boolean {
    // Check viewport visibility
    if (!this.context.viewport.visible) return false;

    // Check motion preferences
    if (this.context.motion === 'static') return false;

    // Check performance constraints
    if (this.context.performance.memoryUsage > layer.performanceBudget.maxMemoryMB) return false;

    // Check interaction state
    if (this.context.interaction.inputFocused && layer.priority < 5) return false;

    return layer.enabled;
  }

  subscribe(layerId: string, callback: (context: OrchestrationContext) => void): void {
    this.observers.set(layerId, callback);
  }

  unsubscribe(layerId: string): void {
    this.observers.delete(layerId);
  }

  private notifyObservers(): void {
    this.context.timing.currentTime = Date.now();
    this.observers.forEach(callback => {
      try {
        callback(this.context);
      } catch (error) {
        console.error('[v0] Observer callback error:', error);
      }
    });
  }

  getContext(): OrchestrationContext {
    return { ...this.context };
  }

  getLayerState(layerId: string): LayerState | null {
    return this.layers.get(layerId)?.state || null;
  }

  destroy(): void {
    this.observers.clear();
    this.layers.clear();
    if (this.performanceMonitor) {
      this.performanceMonitor.disconnect();
    }
  }
}

export function useBackgroundOrchestrator() {
  const orchestratorRef = useRef<BackgroundOrchestrator | null>(null);
  const [context, setContext] = useState<OrchestrationContext | null>(null);

  useEffect(() => {
    orchestratorRef.current = new BackgroundOrchestrator();

    const updateContext = (newContext: OrchestrationContext) => {
      setContext(newContext);
    };

    orchestratorRef.current.subscribe('main', updateContext);
    setContext(orchestratorRef.current.getContext());

    return () => {
      if (orchestratorRef.current) {
        orchestratorRef.current.destroy();
      }
    };
  }, []);

  const registerLayer = useCallback((config: LayerConfig) => {
    orchestratorRef.current?.registerLayer(config);
  }, []);

  const startLayer = useCallback((layerId: string) => {
    return orchestratorRef.current?.startLayer(layerId) || Promise.resolve();
  }, []);

  const stopLayer = useCallback((layerId: string) => {
    orchestratorRef.current?.stopLayer(layerId);
  }, []);

  const pauseLayer = useCallback((layerId: string) => {
    orchestratorRef.current?.pauseLayer(layerId);
  }, []);

  const resumeLayer = useCallback((layerId: string) => {
    orchestratorRef.current?.resumeLayer(layerId);
  }, []);

  return {
    context,
    registerLayer,
    startLayer,
    stopLayer,
    pauseLayer,
    resumeLayer,
    getLayerState: (layerId: string) => orchestratorRef.current?.getLayerState(layerId) || null,
  };
}
