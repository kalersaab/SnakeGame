# Optimization Implementation Checklist

Use this checklist to verify all optimizations are correctly implemented and working.

## Pre-Implementation

- [ ] Backup original files
  ```bash
  cp screen/SnakeGame.tsx screen/SnakeGame.backup.tsx
  cp screen/snakeboard/index.tsx screen/snakeboard/index.backup.tsx
  ```

- [ ] Understand the optimization goals
  - [ ] Read OPTIMIZATION_GUIDE.md
  - [ ] Understand each optimization strategy
  - [ ] Review the performance metrics targets

## File Updates

### Main Component (SnakeGame.tsx)

- [ ] Replace with `SnakeGame.optimized.tsx`
  ```bash
  cp screen/SnakeGame.optimized.tsx screen/SnakeGame.tsx
  ```

- [ ] Verify imports
  ```typescript
  import { useState, useEffect, useCallback, useMemo, memo } from 'react';
  ```

- [ ] Check setInterval setup
  - [ ] GAME_LOOP_INTERVAL = 100ms
  - [ ] Using setTimeout instead of requestAnimationFrame
  - [ ] Cleanup function clears timeout

- [ ] Verify board diff checking
  - [ ] boardHasChanged function exists
  - [ ] Only calls setBoard if board changed
  - [ ] Uses JSON.stringify for comparison

- [ ] Confirm subcomponents are memoized
  - [ ] ControlButton component wrapped in memo()
  - [ ] GameOverModal component wrapped in memo()
  - [ ] ScoreHeader component wrapped in memo()
  - [ ] SnakeBoardContainer component wrapped in memo()
  - [ ] PerformanceMetrics component wrapped in memo()

- [ ] Check useCallback implementations
  - [ ] handleDirectionUp memoized
  - [ ] handleDirectionRight memoized
  - [ ] handleDirectionDown memoized
  - [ ] handleDirectionLeft memoized
  - [ ] handleReset memoized
  - [ ] boardHasChanged memoized

- [ ] Verify useMemo for styles
  - [ ] containerStyle memoized
  - [ ] scrollViewStyle memoized
  - [ ] Dependencies are correct

- [ ] Check performance metrics
  - [ ] fps state created
  - [ ] updateTime state created
  - [ ] renderTime state created
  - [ ] PerformanceMetrics component integrated
  - [ ] Metrics only show in __DEV__ mode

### Board Component (snakeboard/index.tsx)

- [ ] Replace with `snakeboard/index.optimized.tsx`
  ```bash
  cp screen/snakeboard/index.optimized.tsx screen/snakeboard/index.tsx
  ```

- [ ] Verify imports
  ```typescript
  import { memo, useRef, useMemo } from 'react';
  ```

- [ ] Check memoization wrapper
  - [ ] Custom boardPropsAreEqual comparison function
  - [ ] memo() applied with custom comparison
  - [ ] displayName set for DevTools

- [ ] Verify useMemo for dimensions
  - [ ] dimensions object memoized
  - [ ] cellSize, boardWidth, boardHeight computed once per size change
  - [ ] Dependencies: [width, height]

- [ ] Check cells memoization
  - [ ] cells array memoized
  - [ ] Only recomputed when board or cellSize changes
  - [ ] Dependencies: [board, dimensions.cellSize]

- [ ] Verify cell filtering
  - [ ] Empty cells (0) are filtered out
  - [ ] Only non-zero cells create Rect elements
  - [ ] Color assignment is correct (green snake, red food)

## Testing & Verification

### Basic Functionality

- [ ] Game starts without errors
  ```bash
  npm run android  # or npm run ios
  ```

- [ ] Game board displays correctly
  - [ ] Snake renders in green
  - [ ] Food renders in red
  - [ ] Board updates as snake moves

- [ ] Controls work
  - [ ] All directional buttons respond
  - [ ] Buttons show press feedback
  - [ ] Direction changes are registered

- [ ] Game Over state works
  - [ ] Modal appears when game ends
  - [ ] Final score displays correctly
  - [ ] Restart button works

### Performance Metrics

- [ ] Metrics display in top-right corner (dev mode only)
  - [ ] FPS counter shows ~10
  - [ ] Update time shows <5ms
  - [ ] Render time shows <10ms

- [ ] FPS is stable
  - [ ] FPS counter stays around 10 ± 0.5
  - [ ] No significant jitter
  - [ ] No frame skipping

- [ ] Update frequency is correct
  - [ ] Native module called 10 times/sec
  - [ ] Board updates when snake moves
  - [ ] Score updates immediately

### Memoization Verification

Use React DevTools Profiler:

- [ ] Open React DevTools → Profiler
- [ ] Start recording
- [ ] Play game for 10 seconds
- [ ] Stop recording
- [ ] Verify component render counts
  - [ ] ControlButton: Only renders when pressed (1-2 times)
  - [ ] GameOverModal: Renders 0 times until game over
  - [ ] ScoreHeader: Renders only when score changes (typically every 10-20 moves)
  - [ ] SnakeBoardContainer: Renders only when board changes (1-2 times/sec)

- [ ] Check why components re-rendered
  - [ ] Should see "props changed" only, not "parent updated"
  - [ ] Memoization is preventing parent cascade

### Performance Comparison

Before launching full optimization:

- [ ] Compare with original version
  - [ ] Original: FPS ~60, render time high, battery drain noticeable
  - [ ] Optimized: FPS ~10, render time low, battery efficiency improved

- [ ] Test on different devices
  - [ ] High-end device: Silky smooth at 10fps
  - [ ] Mid-range device: No stuttering, good performance
  - [ ] Low-end device: Dramatic improvement over original

### Edge Cases

- [ ] Large board sizes (if implemented)
  - [ ] Performance remains stable
  - [ ] No memory leaks
  - [ ] Board rendering is efficient

- [ ] Rapid direction changes
  - [ ] Handlers respond immediately
  - [ ] No queuing issues
  - [ ] Snake responds correctly

- [ ] Minimize/maximize app
  - [ ] Game loop cleans up on unmount
  - [ ] No memory leaks
  - [ ] Correct state on resume

- [ ] Device rotation
  - [ ] Board resizes correctly
  - [ ] useMemo dimensions update
  - [ ] Controls reposition for new layout

## Code Quality

- [ ] No console errors
  ```bash
  # Check logs for errors
  npm run android 2>&1 | grep -i error
  ```

- [ ] No warnings
  - [ ] useCallback dependencies are correct
  - [ ] useMemo dependencies are correct
  - [ ] memo comparisons work properly

- [ ] TypeScript (if applicable)
  - [ ] All types are correct
  - [ ] Props interfaces are defined
  - [ ] No 'any' types used

- [ ] Code style
  - [ ] Follows project conventions
  - [ ] Consistent formatting
  - [ ] displayName set for all memoized components

## Documentation

- [ ] OPTIMIZATION_GUIDE.md updated
  - [ ] All optimizations documented
  - [ ] Performance metrics explained
  - [ ] Migration guide included

- [ ] Code comments added where helpful
  - [ ] Memoization rationale explained
  - [ ] Non-obvious optimizations documented
  - [ ] Performance tips included

- [ ] README updated (if applicable)
  - [ ] Performance improvements mentioned
  - [ ] How to view metrics documented
  - [ ] Troubleshooting added

## Post-Implementation

- [ ] Performance baseline established
  - [ ] Take screenshots of metrics
  - [ ] Document FPS, update time, render time
  - [ ] Store for comparison

- [ ] Team onboarding
  - [ ] Share optimization guide with team
  - [ ] Explain key decisions
  - [ ] Show how to use profiler

- [ ] Future optimization opportunities identified
  - [ ] Potential Web Worker usage
  - [ ] Advanced React patterns (useTransition, Suspense)
  - [ ] Further Skia optimization

## Monitoring

### Weekly Checks
- [ ] Performance metrics still stable
- [ ] No performance regressions
- [ ] Battery usage is improved

### Monthly Reviews
- [ ] Profiler analysis of render patterns
- [ ] User feedback on performance
- [ ] Opportunities for further optimization

### Before Major Changes
- [ ] Baseline metrics before change
- [ ] Verify change doesn't break memoization
- [ ] Re-test performance after change

## Rollback Plan

If issues arise:

```bash
# Restore original files
cp screen/SnakeGame.backup.tsx screen/SnakeGame.tsx
cp screen/snakeboard/index.backup.tsx screen/snakeboard/index.tsx

# Verify rollback worked
npm run android  # or npm run ios
```

Then investigate the issue and retry.

## Sign Off

- [ ] All tests passed
- [ ] Performance verified
- [ ] Code reviewed
- [ ] Ready for production

**Date Completed**: ___________

**Completed By**: ___________

**Notes**: 
___________________________________________________________________________

---

## Quick Reference

### Key Metrics to Monitor
- **FPS**: Should be ~10 ± 0.5
- **Update Time**: Should be <5ms
- **Render Time**: Should be <10ms
- **Board Re-renders**: Should be 1-2/sec
- **Component Re-renders**: Should be minimal

### Quick Diagnostic
```typescript
// Add to SnakeGame.tsx to debug
React.useEffect(() => {
  console.log('SnakeGame rendered', {
    board: boardState,
    score: score,
    gameOver: gameOver,
    timestamp: Date.now()
  });
}, [boardState, score, gameOver]);
```

### Performance DevTools Command
```javascript
// In React DevTools console
performance.mark('game-start');
// play game for 10 seconds
performance.mark('game-end');
performance.measure('game-loop', 'game-start', 'game-end');
performance.getEntriesByName('game-loop')[0].duration;
```
