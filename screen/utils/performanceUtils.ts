export interface PerformanceMetrics {
  frameCount: number;
  lastFpsUpdate: number;
  lastBoardState: string;
  lastUpdateTime: number;
  lastRenderTime: number;
}

export const initializePerformanceMetrics = (): PerformanceMetrics => ({
  frameCount: 0,
  lastFpsUpdate: Date.now(),
  lastBoardState: JSON.stringify([]),
  lastUpdateTime: 0,
  lastRenderTime: 0,
});

export const calculateFps = (frameCount: number, timeDelta: number): number => {
  return (frameCount * 1000) / timeDelta;
};

export const formatMetrics = (fps: number, updateTime: number, renderTime: number) => ({
  fps: fps.toFixed(1),
  updateTime: updateTime.toFixed(2),
  renderTime: renderTime.toFixed(2),
});
