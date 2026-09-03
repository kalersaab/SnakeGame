import { useEffect, useRef, useState } from 'react';
import { IS_DEV } from '../constants';
import { PerformanceMetrics, initializePerformanceMetrics } from '../utils/performanceUtils';

interface UsePerformanceTrackingReturn {
  fps: number;
  updateTime: number;
  renderTime: number;
  performanceRef: React.MutableRefObject<PerformanceMetrics>;
}

export const usePerformanceTracking = (): UsePerformanceTrackingReturn => {
  const [fps, setFps] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);
  const [renderTime, setRenderTime] = useState(0);

  const performanceRef = useRef<PerformanceMetrics>(initializePerformanceMetrics());

  useEffect(() => {
    if (!IS_DEV) return;

    const renderStart = Date.now();
    return () => {
      const renderEnd = Date.now();
      const newRenderTime = renderEnd - renderStart;
      performanceRef.current.lastRenderTime = newRenderTime;
      setRenderTime(newRenderTime);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (performanceRef.current.lastUpdateTime > 0) {
        setUpdateTime(performanceRef.current.lastUpdateTime);
      }
      const now = Date.now();
      const timeSinceLastFpsUpdate = now - performanceRef.current.lastFpsUpdate;
      if (timeSinceLastFpsUpdate >= 1000) {
        const currentFps = (performanceRef.current.frameCount * 1000) / timeSinceLastFpsUpdate;
        setFps(currentFps);
        performanceRef.current.frameCount = 0;
        performanceRef.current.lastFpsUpdate = now;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return {
    fps,
    updateTime,
    renderTime,
    performanceRef,
  };
};

export { initializePerformanceMetrics };
