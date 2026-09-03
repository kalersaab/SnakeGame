import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ControlButton } from './ControlButton';
import { BUTTON_SIZES, SPACING, COLORS, SHADOWS } from '../constants';

interface DpadControlProps {
  isSmallDevice: boolean;
  onDirectionUp: () => void;
  onDirectionRight: () => void;
  onDirectionDown: () => void;
  onDirectionLeft: () => void;
}

const styles = StyleSheet.create({
  dpadContainer: {
    width: BUTTON_SIZES.DPAD_WIDTH,
    height: BUTTON_SIZES.DPAD_HEIGHT,
    borderRadius: 28,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select(SHADOWS.XLARGE),
    paddingHorizontal: SPACING.MD,
  },
  dpadSmall: {
    width: BUTTON_SIZES.DPAD_SMALL_WIDTH,
    height: BUTTON_SIZES.DPAD_SMALL_HEIGHT,
    borderRadius: 20,
    marginBottom: SPACING.LG,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSmall: {
    marginTop: SPACING.SM,
  },
  spacer: {
    width: 60,
  },
  spacerSmall: {
    width: 48,
  },
  centerContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  centerSmall: {
    marginTop: SPACING.SM,
  },
});

export const DpadControl = memo(
  ({
    isSmallDevice,
    onDirectionUp,
    onDirectionRight,
    onDirectionDown,
    onDirectionLeft,
  }: DpadControlProps) => (
    <View style={[styles.dpadContainer, isSmallDevice && styles.dpadSmall]}>
      {/* Up button */}
      <ControlButton
        direction={0}
        label="↑"
        isSmallDevice={isSmallDevice}
        onPress={onDirectionUp}
      />

      {/* Left, Right buttons */}
      <View style={[styles.rowContainer, isSmallDevice && styles.rowSmall]}>
        <ControlButton
          direction={3}
          label="←"
          isSmallDevice={isSmallDevice}
          onPress={onDirectionLeft}
        />

        <View style={[styles.spacer, isSmallDevice && styles.spacerSmall]} />

        <ControlButton
          direction={1}
          label="→"
          isSmallDevice={isSmallDevice}
          onPress={onDirectionRight}
        />
      </View>

      {/* Down button */}
      <View style={[styles.centerContainer, isSmallDevice && styles.centerSmall]}>
        <ControlButton
          direction={2}
          label="↓"
          isSmallDevice={isSmallDevice}
          onPress={onDirectionDown}
        />
      </View>
    </View>
  ),
);

DpadControl.displayName = 'DpadControl';
