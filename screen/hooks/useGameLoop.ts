import { useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import NativeSnakeModule from '../../specs/NativeSnakeModule';
import { GAME_LOOP_INTERVAL } from '../constants';
import { PerformanceMetrics } from '../utils/performanceUtils';

interface UseGameLoopProps {
  performanceRef: React.MutableRefObject<PerformanceMetrics>;
  setBoard: Dispatch<SetStateAction<number[][]>>;
  setScore: Dispatch<SetStateAction<number>>;
  setGameOver: Dispatch<SetStateAction<boolean>>;
}

export const useGameLoop = ({
  performanceRef,
  setBoard,
  setScore,
  setGameOver,
}: UseGameLoopProps) => {
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
    let intervalId: ReturnType<typeof setTimeout> | null = null;

    const gameLoop = async () => {
      if (!mounted) return;

      const updateStartTime = Date.now();

      try {
        const gameState = await NativeSnakeModule.getGameState();

        if (boardHasChanged(gameState.board)) {
          setBoard(gameState.board);
        }

        setScore(gameState.score);
        setGameOver(gameState.gameOver);

        const updateEndTime = Date.now();
        const newUpdateTime = updateEndTime - updateStartTime;
        performanceRef.current.lastUpdateTime = newUpdateTime;

        performanceRef.current.frameCount++;
        const now = Date.now();
        const timeSinceLastFpsUpdate = now - performanceRef.current.lastFpsUpdate;

        if (timeSinceLastFpsUpdate >= 1000) {
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
  }, [boardHasChanged, setBoard, setScore, setGameOver, performanceRef]);
};

export const useDirectionControls = () => {
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

  return {
    handleDirectionUp,
    handleDirectionRight,
    handleDirectionDown,
    handleDirectionLeft,
    handleReset,
  };
};
