import {StyleSheet, Dimensions} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width,
  WINDOW_HEIGHT = Dimensions.get('window').height,
  SCREEN_WIDTH = Dimensions.get('screen').width,
  SCREEN_HEIGHT = Dimensions.get('screen');

export const DIMENSIONS = {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

export const COLORS = {
  PRIMARY: '#0062FF',
  PRIMARY_TRANSPARENT: '#0062FF32',
  SECONDARY: '#666',
  SECONDARY_TRANSPARENT: '#6666663F',
  BORDER: '#707070',
  BORDER_LIGHT: '#CAD0D8',
  WHITE: '#FFF',
  BLACK: '#000',
  GREEN: '#4DEB96',
  RED: '#E50000',
  PINK: '#E64069',
  TRANSPARENT: '#00000000',
};

export const SPACING = {
  xxs: 2,
  xs: 5,
  s: 8,
  m: 16,
  l: 20,
  xl: 30,
  xxl: 50,
};

export const BORDER_RADIUS = {
  s: 12,
  m: 20,
  l: 28,
  xl: 32,
};

export const buttons = StyleSheet.create({
  primaryButton: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: BORDER_RADIUS.s,

    padding: SPACING.m,
    marginVertical: SPACING.xs,
    width: WINDOW_WIDTH - SPACING.xxl,

    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: BORDER_RADIUS.s,
    borderWidth: SPACING.xxs,

    padding: SPACING.m - SPACING.xxs,
    marginVertical: SPACING.xs,
    width: WINDOW_WIDTH - SPACING.xxl,

    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
  },
  roundedPrimaryButton: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.s,

    backgroundColor: COLORS.PRIMARY,
    width: Math.floor(WINDOW_WIDTH / 2),
  },
  primaryButtonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: BORDER_RADIUS.s,

    padding: SPACING.m,
    marginVertical: SPACING.xs,
    width: WINDOW_WIDTH - SPACING.xxl,

    backgroundColor: COLORS.SECONDARY_TRANSPARENT,
  },
});

export const textStyles = StyleSheet.create({
  primaryButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto-Black',
    color: COLORS.WHITE,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto-Black',
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
  },
  roundedButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Roboto-Bold',
    textTransform: 'capitalize',
    color: COLORS.WHITE,
  },
  paragraphExtraSmall: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Roboto-Medium',
  },
  paragraphSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Roboto-Regular',
  },
  paragraphSmallBold: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Roboto-Medium',
  },
  paragraphMedium: {
    lineHeight: 25,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  paragraphMediumBold: {
    lineHeight: 25,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  paragraphLarge: {
    lineHeight: 25,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  paragraphLargeBold: {
    lineHeight: 25,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  paragraphExtraLarge: {
    fontSize: 28,
    lineHeight: 38,
    fontFamily: 'Roboto-Medium',
  },
  subHeaderHeavy: {
    lineHeight: 25,
    fontSize: 20,
    fontFamily: 'Roboto-Black',
  },
  subHeaderBold: {
    lineHeight: 25,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  bigCardHeading: {
    lineHeight: 28,
    fontSize: 28,
    fontFamily: 'PTSerif-Bold',
  },
  smallCardHeading: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'PTSerif-Bold',
  },
  pageHeader: {
    fontSize: 26,
    lineHeight: 36,
    fontFamily: 'Roboto-Bold',
  },
  serifHeader: {
    fontSize: 26,
    lineHeight: 30,
    fontFamily: 'PTSerif-Regular',
  },
  link: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});
