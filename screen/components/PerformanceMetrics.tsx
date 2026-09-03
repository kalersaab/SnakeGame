import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { IS_DEV, COLORS, FONT_SIZES, SPACING } from '../constants';

interface PerformanceMetricsProps {
  fps: number;
  updateTime: number;
  renderTime: number;
}

const styles = StyleSheet.create({
  metricsContainer: {
    position: 'absolute',
    top: SPACING.LG,
    right: SPACING.LG,
    backgroundColor: COLORS.MODAL_OVERLAY,
    padding: SPACING.SM,
    borderRadius: 8,
    zIndex: 999,
  },
  metricsText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.METRICS_TEXT,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    marginVertical: SPACING.XS,
  },
});

export const PerformanceMetrics = memo(
  ({ fps, updateTime, renderTime }: PerformanceMetricsProps) => {
    if (!IS_DEV) return null;

    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>FPS: {fps.toFixed(1)}</Text>
        <Text style={styles.metricsText}>Update: {updateTime.toFixed(2)}ms</Text>
        <Text style={styles.metricsText}>Render: {renderTime.toFixed(2)}ms</Text>
      </View>
    );
  },
);

PerformanceMetrics.displayName = 'PerformanceMetrics';
