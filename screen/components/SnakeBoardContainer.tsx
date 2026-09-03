import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SnakeBoardSkia } from '../snakeboard';
import { SPACING, SHADOWS } from '../constants';

interface SnakeBoardContainerProps {
  board: number[][];
  isSmallDevice: boolean;
}

const styles = StyleSheet.create({
  gameBoard: {
    marginBottom: SPACING.XXL,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select(SHADOWS.LARGE),
  },
  gameBoardSmall: {
    marginBottom: SPACING.LG,
  },
});

export const SnakeBoardContainer = memo(
  ({ board, isSmallDevice }: SnakeBoardContainerProps) => (
    <View style={[styles.gameBoard, isSmallDevice && styles.gameBoardSmall]}>
      <SnakeBoardSkia board={board} />
    </View>
  ),
);

SnakeBoardContainer.displayName = 'SnakeBoardContainer';
