import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import NativeSnakeModule from '../specs/NativeSnakeModule';
import { SnakeBoardSkia } from './snakeboard';

const SnakeGame = () => {
  const [boardState, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
        Score: {score}
      </Text>
      <SnakeBoardSkia board={boardState} />
      <View style={styles.dpadContainer}>
          <Pressable
            onPress={() => NativeSnakeModule.setDirection(0)}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={styles.controlText}>↑</Text>
          </Pressable>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Pressable
            onPress={() => NativeSnakeModule.setDirection(3)}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={styles.controlText}>←</Text>
          </Pressable>

          <View style={{ width: 60 }} />

          <Pressable
            onPress={() => NativeSnakeModule.setDirection(1)}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={styles.controlText}>→</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Pressable
            onPress={() => NativeSnakeModule.setDirection(2)}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={styles.controlText}>↓</Text>
          </Pressable>
        </View>
      </View>
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>

            <Pressable
              onPress={() => NativeSnakeModule.resetGame()}
              style={styles.restartButton}
            >
              <Text style={styles.restartText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
 controlButton: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: '#0b1b34', 

  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 8,
},

controlButtonPressed: {
  backgroundColor: '#1e40af', // brighter blue
  transform: [{ scale: 0.92 }],
},

controlText: {
  fontSize: 34,
  color: '#f8fafc',
  fontWeight: '600',
},
  dpadContainer: {
  width: 220,
  height: 280,
  borderRadius: 28,
  marginTop: 30,
  backgroundColor: '#020617', // deep navy / near-black
  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.6,
  shadowRadius: 20,
  elevation: 12,
},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#111',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  restartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SnakeGame;
