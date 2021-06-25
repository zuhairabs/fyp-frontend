import { StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';

import { COLORS, textStyles } from '../../styles/styles';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight - 20 : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: DEVICE_HEIGHT + 200,
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
    width: Math.floor(WINDOW_WIDTH / 1.19),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Math.floor(WINDOW_WIDTH / 25),
    marginTop: '-2%',
    // borderWidth: 2
  },
  dropText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto'
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
    borderRadius: Math.floor(WINDOW_WIDTH / 15),
    backgroundColor: '#E0E0E0',
    marginTop: '-6%',
    width: Math.floor(WINDOW_WIDTH / 1.3),
    height: Math.floor(WINDOW_WIDTH / 5),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0.2%',
    fontFamily: 'Roboto'
  },
  email: {
    flexDirection: 'row',
    borderRadius: Math.floor(WINDOW_WIDTH / 22),
    backgroundColor: '#E0E0E0',
    marginTop: Math.floor(WINDOW_WIDTH / 60),
    width: Math.floor(WINDOW_WIDTH / 1.3),
    height: Math.floor(WINDOW_WIDTH / 8),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0.2%',
    fontFamily: 'Roboto'
  },
  productDeatilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    // width: Math.floor(WINDOW_WIDTH / 1.1),
    // marginLeft: '2%',
    // marginRight: '2%',
    // borderWidth: 2
  },
  image: {
    width: Math.floor(WINDOW_WIDTH / 2.7),
    height: Math.floor(WINDOW_WIDTH / 2.7),
    borderRadius: Math.floor(WINDOW_WIDTH / 20),
  },
  description: {
    flex: 1,
    alignContent: 'center',
    color: '#000',
    marginTop: '2%',
    paddingLeft: Math.floor(WINDOW_WIDTH / 20),
  },
  shadow: {
    elevation: 10
  },
  pricingContainer: {
    backgroundColor: 'transparent',
    color: '#0000ff',
    fontFamily: 'Roboto',
    alignItems: 'center',
    justifyContent: 'space-between',
    // margin: Math.floor(WINDOW_WIDTH / 30),
    // marginTop: '5%',
    // marginBottom: '50%',
    // borderWidth: 2
  },
  pricing: {
    width: Math.floor(WINDOW_WIDTH / 1.5),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: '#000',
    marginBottom: Math.floor(WINDOW_WIDTH / 100),
  },
  label: {
    width: Math.floor(WINDOW_WIDTH / 2),
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'Roboto'
  },
  value: {
    width: Math.floor(WINDOW_WIDTH / 3),
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto'
  },
});

export default styles;