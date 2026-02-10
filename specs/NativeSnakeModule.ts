import {TurboModuleRegistry, TurboModule} from 'react-native';
export interface Spec extends TurboModule {
   getBoardState():number[][];
    setDirection(direction: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSnakeModule');
