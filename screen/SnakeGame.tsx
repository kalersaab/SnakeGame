import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import NativeSnakeModule from '../specs/NativeSnakeModule';
import { SnakeBoardSkia } from './snakeboard';

const SnakeGame = () => {
  const [boardState, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 400 || height < 600;

  React.useEffect(() => {
    let mounted = true;

    const loop = async () => {
      if (!mounted) return;
      const gameState = await NativeSnakeModule.getGameState();
      setBoard(gameState.board);
      setScore(gameState.score);
      setGameOver(gameState.gameOver);
      requestAnimationFrame(loop);
    };

    loop();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, isSmallDevice && styles.containerSmall]}
      scrollEnabled={isSmallDevice}
    >
      <View style={[styles.header, isSmallDevice && styles.headerSmall]}>
        <Text style={[styles.title, isSmallDevice && styles.titleSmall]}>
          🐍 SNAKE GAME
        </Text>
        <Text style={[styles.scoreDisplay, isSmallDevice && styles.scoreSmall]}>
          Score: {score}
        </Text>
      </View>

      <View style={[styles.gameBoard, isSmallDevice && styles.gameBoardSmall]}>
        <SnakeBoardSkia board={boardState} />
      </View>

      <View style={[styles.dpadContainer, isSmallDevice && styles.dpadSmall]}>
        <Pressable
          onPress={() => NativeSnakeModule.setDirection(0)}
          style={({ pressed }) => [
            styles.controlButton,
            isSmallDevice && styles.controlButtonSmall,
            pressed && styles.controlButtonPressed,
          ]}
        >
          <Text style={[styles.controlText, isSmallDevice && styles.controlTextSmall]}>
            ↑
          </Text>
        </Pressable>

        <View style={[styles.rowContainer, isSmallDevice && styles.rowSmall]}>
          <Pressable
            onPress={() => NativeSnakeModule.setDirection(3)}
            style={({ pressed }) => [
              styles.controlButton,
              isSmallDevice && styles.controlButtonSmall,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={[styles.controlText, isSmallDevice && styles.controlTextSmall]}>
              ←
            </Text>
          </Pressable>

          <View style={[styles.spacer, isSmallDevice && styles.spacerSmall]} />

          <Pressable
            onPress={() => NativeSnakeModule.setDirection(1)}
            style={({ pressed }) => [
              styles.controlButton,
              isSmallDevice && styles.controlButtonSmall,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={[styles.controlText, isSmallDevice && styles.controlTextSmall]}>
              →
            </Text>
          </Pressable>
        </View>

        <View style={[styles.centerContainer, isSmallDevice && styles.centerSmall]}>
          <Pressable
            onPress={() => NativeSnakeModule.setDirection(2)}
            style={({ pressed }) => [
              styles.controlButton,
              isSmallDevice && styles.controlButtonSmall,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={[styles.controlText, isSmallDevice && styles.controlTextSmall]}>
              ↓
            </Text>
          </Pressable>
        </View>
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <View style={[styles.modal, isSmallDevice && styles.modalSmall]}>
            <Text style={[styles.gameOverText, isSmallDevice && styles.gameOverSmall]}>
              GAME OVER
            </Text>
            <Text style={[styles.scoreText, isSmallDevice && styles.scoreTextSmall]}>
              Final Score: {score}
            </Text>

            <Pressable
              onPress={() => NativeSnakeModule.resetGame()}
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
      )}
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
});

export default SnakeGame;
