import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface ScoreHeaderProps {
  score: number;
  isSmallDevice: boolean;
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XXL,
  },
  headerSmall: {
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZES.XXXXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  titleSmall: {
    fontSize: FONT_SIZES.XXL,
    marginBottom: SPACING.XS,
  },
  scoreDisplay: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  scoreSmall: {
    fontSize: FONT_SIZES.MD,
  },
});

export const ScoreHeader = memo(({ score, isSmallDevice }: ScoreHeaderProps) => (
  <View style={[styles.header, isSmallDevice && styles.headerSmall]}>
    <Text style={[styles.title, isSmallDevice && styles.titleSmall]}>🐍 SNAKE GAME</Text>
    <Text style={[styles.scoreDisplay, isSmallDevice && styles.scoreSmall]}>
      Score: {score}
    </Text>
  </View>
));

ScoreHeader.displayName = 'ScoreHeader';
