import { Canvas, Rect } from '@shopify/react-native-skia';
import React, { useMemo, memo, useRef } from 'react';
import { useWindowDimensions } from 'react-native';

type Props = {
  board: number[][];
};

const ROWS = 20;
const COLS = 20;

const SnakeBoardSkiaComponent = ({ board }: Props) => {
  const { width, height } = useWindowDimensions();

  const dimensions = useMemo(() => {
    const maxCellSize = Math.min(
      Math.floor((width - 40) / COLS),
      Math.floor((height - 300) / ROWS),
      30
    );

    const cellSize = Math.max(maxCellSize, 15);
    return {
      cellSize,
      boardWidth: COLS * cellSize,
      boardHeight: ROWS * cellSize,
    };
  }, [width, height]);

  const cells = useMemo(() => {
    return board.flatMap((row, r) =>
      row
        .map((cell, c) => {
          if (cell === 0) return null;

          return {
            key: `${r}-${c}`,
            x: c * dimensions.cellSize,
            y: r * dimensions.cellSize,
            size: dimensions.cellSize - 1,
            color: cell === 1 ? '#22c55e' : '#ef4444',
          };
        })
        .filter((item) => item !== null)
    );
  }, [board, dimensions.cellSize]);

  return (
    <Canvas
      style={{
        width: dimensions.boardWidth,
        height: dimensions.boardHeight,
        backgroundColor: '#0f172a',
        borderRadius: 12,
      }}
    >
      {cells.map((cell) => (
        <Rect
          key={cell.key}
          x={cell.x}
          y={cell.y}
          width={cell.size}
          height={cell.size}
          color={cell.color}
        />
      ))}
    </Canvas>
  );
};

const boardPropsAreEqual = (prevProps: Props, nextProps: Props): boolean => {
  return JSON.stringify(prevProps.board) === JSON.stringify(nextProps.board);
};

export const SnakeBoardSkia = memo(SnakeBoardSkiaComponent, boardPropsAreEqual);
SnakeBoardSkia.displayName = 'SnakeBoardSkia';
