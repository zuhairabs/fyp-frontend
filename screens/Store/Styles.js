import {StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import {COLORS, textStyles} from '../../styles/styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT =
  DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);
export const headerHeight = Math.floor(WINDOW_HEIGHT / 2.8);

export const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: Dimensions.get('screen').height,
    backgroundColor: COLORS.WHITE,
  },
  contentContainer: {
    backgroundColor: '#FEFEFE6F',
    zIndex: 5,
    marginTop: 20,
  },
  ratingBadge: {
    position: 'absolute',
    right: Math.floor(WINDOW_WIDTH / 25),
    top: -Math.floor(WINDOW_HEIGHT / 40),
    zIndex: 2,
    elevation: 2,
  },
  storeDetails: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  heading: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  headingText: {
    justifyContent: 'center',
  },
  reviewCountHeading: {
    color: COLORS.SECONDARY,
    textDecorationLine: 'underline',
    ...textStyles.paragraphSmallBold,
  },
  headingRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favouriteIcon: {
    marginBottom: 10,
    elevation: 5,
    backgroundColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 40 / 2,
  },
  location: {
    marginTop: 10,
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmallBold,
  },
  subheading: {
    marginTop: 20,
    ...textStyles.paragraphLargeBold,
  },
  safetyContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
  },
  safetyElement: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
  },
  safetyElementText: {
    marginLeft: 5,
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmallBold,
  },
  detailsContainer: {
    marginTop: 30,
  },
  details: {
    ...textStyles.paragraphMedium,
  },
  button: {
    position: 'relative',
    zIndex: 2,
    top: 0,
    width: WINDOW_WIDTH,
    height: Math.floor(WINDOW_HEIGHT / 20),
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: NAVIGATION_HEIGHT > 0 ? 30 : 40,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginBottom: DEVICE_HEIGHT - WINDOW_HEIGHT - 30,
  },
  buttonText: {
    ...textStyles.primaryButtonText,
  },
});
