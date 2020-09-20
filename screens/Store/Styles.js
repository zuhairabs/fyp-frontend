import {StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import {COLORS, textStyles} from '../../styles/styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
export const headerHeight = Math.floor(WINDOW_HEIGHT / 2.8);

export const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  contentContainer: {
    backgroundColor: '#FEFEFE6F',
    zIndex: 5,
    marginTop: 20,
    marginBottom: 120,
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
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    marginVertical: 15,
  },
  details: {
    ...textStyles.paragraphMedium,
  },
  bottomSheetWrapper: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  bottomSheetContainer: {
    height: WINDOW_HEIGHT / 1.1,
    backgroundColor: COLORS.TRANSPARENT,
  },
  bottomSheetDraggableIcon: {
    display: 'none',
  },
});
