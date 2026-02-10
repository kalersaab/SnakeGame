import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import NativeSnakeModule from '../specs/NativeSnakeModule';

const SnakeGame = () => {
  const [boardState, setBoard] = React.useState<number[][]>([]);
  React.useEffect(() => {
  let mounted = true;

  const loop = async () => {
    if (!mounted) return;
    const state = await NativeSnakeModule.getBoardState();
    setBoard(state);
    requestAnimationFrame(loop);
  };

  loop();
  return () => { mounted = false };
}, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {boardState.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            marginBottom: 2,
          }}
        >
          {row.map((cell, cellIndex) => (
            <Text
              key={cellIndex}
              style={{
                fontSize: 40,
                width: 50,
                height: 50,
                textAlign: 'center',
                borderWidth: 1,
              }}
            >
              {cell === 0 ? ' ' : cell === 1 ? '🟩' : '🍎'}
            </Text>
          ))}
        </View>
      ))}
     <View style={{ marginTop: 20 }}>
  <View style={{ alignItems: 'center' }}>
    <Pressable
      onPress={() => NativeSnakeModule.setDirection(0)}
      style={styles.controlButton}
    >
      <Text style={styles.controlText}>↑</Text>
    </Pressable>
  </View>

  <View style={{ flexDirection: 'row', marginTop: 10 }}>
    <Pressable
      onPress={() => NativeSnakeModule.setDirection(3)}
      style={styles.controlButton}
    >
      <Text style={styles.controlText}>←</Text>
    </Pressable>

    <View style={{ width: 20 }} />

    <Pressable
      onPress={() => NativeSnakeModule.setDirection(1)}
      style={styles.controlButton}
    >
      <Text style={styles.controlText}>→</Text>
    </Pressable>
  </View>

  <View style={{ alignItems: 'center', marginTop: 10 }}>
    <Pressable
      onPress={() => NativeSnakeModule.setDirection(2)}
      style={styles.controlButton}
    >
      <Text style={styles.controlText}>↓</Text>
    </Pressable>
  </View>
</View>
      
    </View>
  );
};
const styles = StyleSheet.create({
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  controlText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});


export default SnakeGame;
