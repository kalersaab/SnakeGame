import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import NativeSnakeModule from '../specs/NativeSnakeModule';
import { SnakeBoardSkia } from './snakeboard';

const GAME_LOOP_INTERVAL = 100;
const __DEV__ = true;

interface ControlButtonProps {
  direction: number;
  label: string;
  isSmallDevice: boolean;
  onPress: () => void;
}

const ControlButton = memo(({ direction, label, isSmallDevice, onPress }: ControlButtonProps) => (
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
));

ControlButton.displayName = 'ControlButton';

interface GameOverModalProps {
  score: number;
  isSmallDevice: boolean;
  onRestart: () => void;
}

const GameOverModal = memo(({ score, isSmallDevice, onRestart }: GameOverModalProps) => (
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
));

GameOverModal.displayName = 'GameOverModal';

interface ScoreHeaderProps {
  score: number;
  isSmallDevice: boolean;
}

const ScoreHeader = memo(({ score, isSmallDevice }: ScoreHeaderProps) => (
  <View style={[styles.header, isSmallDevice && styles.headerSmall]}>
    <Text style={[styles.title, isSmallDevice && styles.titleSmall]}>
      🐍 SNAKE GAME
    </Text>
    <Text style={[styles.scoreDisplay, isSmallDevice && styles.scoreSmall]}>
      Score: {score}
    </Text>
  </View>
));

ScoreHeader.displayName = 'ScoreHeader';

interface SnakeBoardContainerProps {
  board: number[][];
  isSmallDevice: boolean;
}

const SnakeBoardContainer = memo(({ board, isSmallDevice }: SnakeBoardContainerProps) => (
  <View style={[styles.gameBoard, isSmallDevice && styles.gameBoardSmall]}>
    <SnakeBoardSkia board={board} />
  </View>
));

SnakeBoardContainer.displayName = 'SnakeBoardContainer';

interface PerformanceMetricsProps {
  fps: number;
  updateTime: number;
  renderTime: number;
}

const PerformanceMetrics = memo(({ fps, updateTime, renderTime }: PerformanceMetricsProps) => {
  if (!__DEV__) return null;

  return (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsText}>FPS: {fps.toFixed(1)}</Text>
      <Text style={styles.metricsText}>Update: {updateTime.toFixed(2)}ms</Text>
      <Text style={styles.metricsText}>Render: {renderTime.toFixed(2)}ms</Text>
    </View>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

const SnakeGame = () => {
  const [boardState, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [fps, setFps] = useState(0);
  const [updateTime, setUpdateTime] = useState(0);
  const [renderTime, setRenderTime] = useState(0);

  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 400 || height < 600;

  const performanceRef = React.useRef({
    frameCount: 0,
    lastFpsUpdate: Date.now(),
    lastBoardState: JSON.stringify([]),
    lastUpdateTime: 0,
    lastRenderTime: 0,
  });

  const containerStyle = useMemo(() => 
    [styles.container, isSmallDevice && styles.containerSmall],
    [isSmallDevice]
  );

  const scrollViewStyle = useMemo(() => ({
    contentContainerStyle: containerStyle,
    scrollEnabled: isSmallDevice,
  }), [containerStyle, isSmallDevice]);

  const handleDirectionUp = useCallback(() => {
    NativeSnakeModule.setDirection(0);
  }, []);

  const handleDirectionRight = useCallback(() => {
    NativeSnakeModule.setDirection(1);
  }, []);

  const handleDirectionDown = useCallback(() => {
    NativeSnakeModule.setDirection(2);
  }, []);

  const handleDirectionLeft = useCallback(() => {
    NativeSnakeModule.setDirection(3);
  }, []);

  const handleReset = useCallback(() => {
    NativeSnakeModule.resetGame();
  }, []);

  const boardHasChanged = useCallback((newBoard: number[][]): boolean => {
    const newBoardStr = JSON.stringify(newBoard);
    const changed = newBoardStr !== performanceRef.current.lastBoardState;
    if (changed) {
      performanceRef.current.lastBoardState = newBoardStr;
    }
    return changed;
  }, []);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const gameLoop = async () => {
      if (!mounted) return;

      const updateStartTime = performance.now();

      try {
        const gameState = await NativeSnakeModule.getGameState();

        if (boardHasChanged(gameState.board)) {
          setBoard(gameState.board);
        }

        setScore(gameState.score);
        setGameOver(gameState.gameOver);

        const updateEndTime = performance.now();
        const newUpdateTime = updateEndTime - updateStartTime;
        performanceRef.current.lastUpdateTime = newUpdateTime;
        if (__DEV__) {
          setUpdateTime(newUpdateTime);
        }

        // Track FPS
        performanceRef.current.frameCount++;
        const now = Date.now();
        const timeSinceLastFpsUpdate = now - performanceRef.current.lastFpsUpdate;

        if (timeSinceLastFpsUpdate >= 1000) {
          const currentFps = (performanceRef.current.frameCount * 1000) / timeSinceLastFpsUpdate;
          if (__DEV__) {
            setFps(currentFps);
          }
          performanceRef.current.frameCount = 0;
          performanceRef.current.lastFpsUpdate = now;
        }
      } catch (error) {
        console.error('Game loop error:', error);
      }

      if (mounted) {
        intervalId = setTimeout(gameLoop, GAME_LOOP_INTERVAL);
      }
    };

    gameLoop();

    return () => {
      mounted = false;
      if (intervalId !== null) {
        clearTimeout(intervalId);
      }
    };
  }, [boardHasChanged]);

  useEffect(() => {
    if (__DEV__) {
      const renderStart = performance.now();
      return () => {
        const renderEnd = performance.now();
        const newRenderTime = renderEnd - renderStart;
        performanceRef.current.lastRenderTime = newRenderTime;
        setRenderTime(newRenderTime);
      };
    }
  }, [boardState, score, gameOver, isSmallDevice]);

  return (
    <ScrollView {...scrollViewStyle}>
      <ScoreHeader score={score} isSmallDevice={isSmallDevice} />

      <SnakeBoardContainer board={boardState} isSmallDevice={isSmallDevice} />

      <View style={[styles.dpadContainer, isSmallDevice && styles.dpadSmall]}>
        <ControlButton
          direction={0}
          label="↑"
          isSmallDevice={isSmallDevice}
          onPress={handleDirectionUp}
        />

        <View style={[styles.rowContainer, isSmallDevice && styles.rowSmall]}>
          <ControlButton
            direction={3}
            label="←"
            isSmallDevice={isSmallDevice}
            onPress={handleDirectionLeft}
          />

          <View style={[styles.spacer, isSmallDevice && styles.spacerSmall]} />

          <ControlButton
            direction={1}
            label="→"
            isSmallDevice={isSmallDevice}
            onPress={handleDirectionRight}
          />
        </View>

        <View style={[styles.centerContainer, isSmallDevice && styles.centerSmall]}>
          <ControlButton
            direction={2}
            label="↓"
            isSmallDevice={isSmallDevice}
            onPress={handleDirectionDown}
          />
        </View>
      </View>

      {gameOver && (
        <GameOverModal
          score={score}
          isSmallDevice={isSmallDevice}
          onRestart={handleReset}
        />
      )}

      <PerformanceMetrics fps={fps} updateTime={updateTime} renderTime={renderTime} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        paddingTop: 60,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  containerSmall: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSmall: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  titleSmall: {
    fontSize: 24,
    marginBottom: 6,
  },
  scoreDisplay: {
    fontSize: 24,
    fontWeight: '600',
    color: '#64748b',
  },
  scoreSmall: {
    fontSize: 18,
  },
  gameBoard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gameBoardSmall: {
    marginBottom: 16,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0b1b34',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  controlButtonSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  controlButtonPressed: {
    backgroundColor: '#1e40af',
    transform: [{ scale: 0.92 }],
  },
  controlText: {
    fontSize: 34,
    color: '#f8fafc',
    fontWeight: '600',
  },
  controlTextSmall: {
    fontSize: 28,
  },
  dpadContainer: {
    width: 220,
    height: 280,
    borderRadius: 28,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
    paddingHorizontal: 12,
  },
  dpadSmall: {
    width: 180,
    height: 220,
    borderRadius: 20,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSmall: {
    marginTop: 8,
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
    marginTop: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#111',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
    maxWidth: 320,
  },
  modalSmall: {
    padding: 20,
    borderRadius: 16,
    maxWidth: 280,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameOverSmall: {
    fontSize: 28,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 22,
    color: '#f8fafc',
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreTextSmall: {
    fontSize: 18,
    marginBottom: 16,
  },
  restartButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 28,
    minWidth: 180,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  restartButtonSmall: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 160,
  },
  restartButtonPressed: {
    backgroundColor: '#16a34a',
    transform: [{ scale: 0.96 }],
  },
  restartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  restartTextSmall: {
    fontSize: 16,
  },
  metricsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 8,
    zIndex: 999,
  },
  metricsText: {
    fontSize: 10,
    color: '#22c55e',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    marginVertical: 2,
  },
});

export default SnakeGame;
