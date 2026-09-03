import { Canvas, Rect } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

type Props = {
  board: number[][];
};

const ROWS = 20;
const COLS = 20;

export const SnakeBoardSkia = ({ board }: Props) => {
  const { width, height } = useWindowDimensions();
  
  // Calculate cell size based on available space, max 30px per cell
  const maxCellSize = Math.min(
    Math.floor((width - 40) / COLS),
    Math.floor((height - 300) / ROWS),
    30
  );
  
  const CELL_SIZE = Math.max(maxCellSize, 15); // Minimum 15px cells
  const BOARD_WIDTH = COLS * CELL_SIZE;
  const BOARD_HEIGHT = ROWS * CELL_SIZE;

  return (
    <Canvas
      style={{
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        backgroundColor: '#0f172a',
        borderRadius: 12,
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          if (cell === 0) return null;

          return (
            <Rect
              key={`${r}-${c}`}
              x={c * CELL_SIZE}
              y={r * CELL_SIZE}
              width={CELL_SIZE - 1} // Small gap between cells
              height={CELL_SIZE - 1}
              color={cell === 1 ? '#22c55e' : '#ef4444'} // Green snake, red food
            />
          );
        })
      )}
    </Canvas>
  );
};
