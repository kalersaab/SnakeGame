import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, BUTTON_SIZES, FONT_SIZES, SHADOWS } from '../constants';

interface ControlButtonProps {
  direction: number;
  label: string;
  isSmallDevice: boolean;
  onPress: () => void;
}

const styles = StyleSheet.create({
  controlButton: {
    width: BUTTON_SIZES.LARGE.WIDTH,
    height: BUTTON_SIZES.LARGE.HEIGHT,
    borderRadius: BUTTON_SIZES.LARGE.RADIUS,
    backgroundColor: COLORS.CONTROL_BG,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select(SHADOWS.MEDIUM),
  },
  controlButtonSmall: {
    width: BUTTON_SIZES.SMALL.WIDTH,
    height: BUTTON_SIZES.SMALL.HEIGHT,
    borderRadius: BUTTON_SIZES.SMALL.RADIUS,
  },
  controlButtonPressed: {
    backgroundColor: COLORS.CONTROL_PRESSED,
    transform: [{ scale: 0.92 }],
  },
  controlText: {
    fontSize: FONT_SIZES.TITLE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  controlTextSmall: {
    fontSize: FONT_SIZES.XXXL,
  },
});

export const ControlButton = memo(
  ({ direction, label, isSmallDevice, onPress }: ControlButtonProps) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.controlButton,
        isSmallDevice && styles.controlButtonSmall,
        pressed && styles.controlButtonPressed,
      ]}
    >
      <Text style={[styles.controlText, isSmallDevice && styles.controlTextSmall]}>
        {label}
      </Text>
    </Pressable>
  ),
);

ControlButton.displayName = 'ControlButton';
