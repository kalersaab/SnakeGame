import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { DEVICE_THRESHOLDS, COLORS, SPACING } from './constants';
import { usePerformanceTracking } from './hooks/usePerformanceTracking';
import { ScoreHeader } from './components/ScoreHeader';
import { SnakeBoardContainer } from './components/SnakeBoardContainer';
import { DpadControl } from './components/DpadControl';
import { GameOverModal } from './components/GameOverModal';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { useDirectionControls, useGameLoop } from './hooks/useGameLoop';

const SnakeGame = () => {
  const [boardState, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < DEVICE_THRESHOLDS.SMALL_WIDTH || height < DEVICE_THRESHOLDS.SMALL_HEIGHT;

  const { fps, updateTime, renderTime, performanceRef } = usePerformanceTracking();

  const { handleDirectionUp, handleDirectionRight, handleDirectionDown, handleDirectionLeft, handleReset } =
    useDirectionControls();

  useGameLoop({
    performanceRef,
    setBoard,
    setScore,
    setGameOver,
  });

  const containerStyle = useMemo(
    () => [styles.container, isSmallDevice && styles.containerSmall],
    [isSmallDevice],
  );

  const scrollViewStyle = useMemo(
    () => ({
      contentContainerStyle: containerStyle,
      scrollEnabled: isSmallDevice,
    }),
    [containerStyle, isSmallDevice],
  );

  return (
    <ScrollView {...scrollViewStyle}>
      <ScoreHeader score={score} isSmallDevice={isSmallDevice} />
      <SnakeBoardContainer board={boardState} isSmallDevice={isSmallDevice} />

      <DpadControl
        isSmallDevice={isSmallDevice}
        onDirectionUp={handleDirectionUp}
        onDirectionRight={handleDirectionRight}
        onDirectionDown={handleDirectionDown}
        onDirectionLeft={handleDirectionLeft}
      />

      {gameOver && <GameOverModal score={score} isSmallDevice={isSmallDevice} onRestart={handleReset} />}

      <PerformanceMetrics fps={fps} updateTime={updateTime} renderTime={renderTime} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XL,
    ...Platform.select({
      ios: {
        paddingTop: 60,
      },
      android: {
        paddingTop: SPACING.LG,
      },
    }),
  },
  containerSmall: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
  },
});

export default SnakeGame;
