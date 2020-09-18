import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import {COLORS, textStyles, SPACING, BORDER_RADIUS} from '../../styles/styles';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT =
  DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);

export const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    marginHorizontal: 20,
    height: WINDOW_HEIGHT,
  },
  header: {
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.BORDER_LIGHT,
    paddingBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    ...textStyles.paragraphLargeBold,
    marginTop: 10,
    maxWidth: '100%',
  },
  link: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  buttonArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    backgroundColor: COLORS.SECONDARY_TRANSPARENT,
    borderRadius: 8,
  },
  buttonCaption: {
    marginTop: 5,
  },
  contentContainer: {
    marginBottom: 120,
  },
});

export const buttonStyles = StyleSheet.create({
  buttonArea: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    elevation: 10,
    bottom: NAVIGATION_HEIGHT,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: NAVIGATION_HEIGHT - 30 > 0 ? NAVIGATION_HEIGHT - 30 : 30,
  },
  primaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    padding: SPACING.m,
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    borderWidth: SPACING.xxs,
    padding: SPACING.m - SPACING.xxs,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.WHITE,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
  },
});
