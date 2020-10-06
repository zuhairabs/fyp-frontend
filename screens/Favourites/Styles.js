import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import {COLORS} from '../../styles/styles';
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    marginBottom: 50 + DEVICE_HEIGHT - WINDOW_HEIGHT,
    height: DEVICE_HEIGHT,
  },
  dropdown: {
    position: 'absolute',
    zIndex: 5,
    elevation: 3,
    maxHeight: DEVICE_HEIGHT / 2.8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    width: '100%',
    top: 50,
  },
  headerContainer: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    zIndex: 2,
  },
  dropdownTextBox: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dropdownText: {
    textTransform: 'capitalize',
    color: COLORS.SECONDARY,
    fontSize: 15,
  },
});

export default styles;
