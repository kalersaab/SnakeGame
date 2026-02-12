import { TurboModuleRegistry, TurboModule } from 'react-native';
export interface Spec extends TurboModule {
  setDirection(direction: number): void;
  getScore(): number;
  getGameState(): {
  board: number[][],
  score: number,
  gameOver: boolean,
};
resetGame(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSnakeModule');
