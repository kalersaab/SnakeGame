import { Canvas, Rect, Skia } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';

type Props = {
  board: number[][];
};
const CELL_SIZE = 25;
const ROWS = 20;
const COLS = 20;
export const SnakeBoardSkia = ({ board }: Props) => {
  const BOARD_WIDTH = COLS * CELL_SIZE;
const BOARD_HEIGHT = ROWS * CELL_SIZE;
  return (
 <Canvas
  style={{
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#0f172a',
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
          width={CELL_SIZE}
          height={CELL_SIZE}
          color={cell === 1 ? '#22c55e' : '#ef4444'}
        />
      );
    })
  )}
</Canvas>
  );
};
