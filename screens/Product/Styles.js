import { StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';

import { COLORS, textStyles } from '../../styles/styles';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: WINDOW_HEIGHT,
  },
  cartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    // borderWidth: 2
  },
  dropDownBar: {
    width: Math.floor(WINDOW_WIDTH/1.15),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: Math.floor(WINDOW_WIDTH / 25),
    // borderWidth: 2
  },
  dropText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    height: Math.floor(WINDOW_WIDTH / 20),
    width: Math.floor(WINDOW_WIDTH / 4),
    color: '#616161',
    textAlign: 'center',
    alignItems: 'center',
    marginLeft: Math.floor(WINDOW_WIDTH / 20),
  },
  address: {
    flexDirection: 'row',
    borderRadius: Math.floor(WINDOW_WIDTH / 6),
    backgroundColor: '#E0E0E0',
    marginTop: Math.floor(WINDOW_WIDTH / 30),
    width: Math.floor(WINDOW_WIDTH / 1.5),
    height: Math.floor(WINDOW_WIDTH / 5),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: Math.floor(WINDOW_WIDTH / 30)
  },
  email: {
    flexDirection: 'row',
    borderRadius: Math.floor(WINDOW_WIDTH / 8),
    backgroundColor: '#E0E0E0',
    marginTop: Math.floor(WINDOW_WIDTH / 30),
    width: Math.floor(WINDOW_WIDTH / 1.5),
    height: Math.floor(WINDOW_WIDTH / 8),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: Math.floor(WINDOW_WIDTH / 30)
  },
  productDeatilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: Math.floor(WINDOW_WIDTH/1.1)
  },
  image: {
    width: Math.floor(WINDOW_WIDTH / 3),
    height: Math.floor(WINDOW_WIDTH / 3),
    borderRadius: Math.floor(WINDOW_WIDTH / 20),
  },
  description: {
    flex: 1,
    alignContent: 'center',
    color: '#000',
    paddingLeft: Math.floor(WINDOW_WIDTH / 20),
  },
  shadow: {
    elevation: 10
  },
  pricingContainer: {
    backgroundColor: 'transparent',
    color: '#0000ff',
    alignItems: 'center',
    justifyContent: 'space-between',
    // margin: Math.floor(WINDOW_WIDTH / 30),
    marginTop: Math.floor(WINDOW_WIDTH / 50),
    // marginBottom: -Math.floor(WINDOW_WIDTH / 20),
    // borderWidth: 2
  },
  pricing: {
    width: Math.floor(WINDOW_WIDTH / 1.5),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: '#000',
    fontSize: 24,
    marginBottom: Math.floor(WINDOW_WIDTH / 100)
  },
  label: {
    width: Math.floor(WINDOW_WIDTH / 2),
    textAlign: 'left',
    fontSize: 18,
  },
  value: {
    width: Math.floor(WINDOW_WIDTH / 3),
    textAlign: 'right',
    fontSize: 20,
  }
});

export default styles;