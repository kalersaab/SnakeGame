import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../constants';

interface GameOverModalProps {
  score: number;
  isSmallDevice: boolean;
  onRestart: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.MODAL_BG,
    padding: SPACING.XXXL,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select(SHADOWS.XXLARGE),
    maxWidth: 320,
  },
  modalSmall: {
    padding: SPACING.LG,
    borderRadius: 16,
    maxWidth: 280,
  },
  gameOverText: {
    fontSize: FONT_SIZES.XXXXL,
    fontWeight: 'bold',
    color: COLORS.ERROR,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  gameOverSmall: {
    fontSize: FONT_SIZES.XXXL,
    marginBottom: SPACING.SM,
  },
  scoreText: {
    fontSize: FONT_SIZES.XL,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XXL,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreTextSmall: {
    fontSize: FONT_SIZES.MD,
    marginBottom: SPACING.LG,
  },
  restartButton: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: SPACING.XXXL,
    paddingVertical: SPACING.LG,
    borderRadius: 28,
    minWidth: 180,
    ...Platform.select(SHADOWS.SMALL),
  },
  restartButtonSmall: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    minWidth: 160,
  },
  restartButtonPressed: {
    backgroundColor: COLORS.SUCCESS_DARK,
    transform: [{ scale: 0.96 }],
  },
  restartText: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  restartTextSmall: {
    fontSize: FONT_SIZES.MD,
  },
});

export const GameOverModal = memo(
  ({ score, isSmallDevice, onRestart }: GameOverModalProps) => (
    <View style={styles.overlay}>
      <View style={[styles.modal, isSmallDevice && styles.modalSmall]}>
        <Text style={[styles.gameOverText, isSmallDevice && styles.gameOverSmall]}>
          GAME OVER
        </Text>
        <Text style={[styles.scoreText, isSmallDevice && styles.scoreTextSmall]}>
          Final Score: {score}
        </Text>
        <Pressable
          onPress={onRestart}
          style={({ pressed }) => [
            styles.restartButton,
            isSmallDevice && styles.restartButtonSmall,
            pressed && styles.restartButtonPressed,
          ]}
        >
          <Text style={[styles.restartText, isSmallDevice && styles.restartTextSmall]}>
            Restart Game
          </Text>
        </Pressable>
      </View>
    </View>
  ),
);

GameOverModal.displayName = 'GameOverModal';
