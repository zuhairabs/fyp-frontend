import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../styles/styles';
export const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.BLACK,
    flex: 1,
  },
  camaraComponent: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    opacity: 0.5,
  },
  userImage: {
    height: Dimensions.get('window').width / 3.5,
    width: Dimensions.get('window').width / 3.5,
    borderRadius: Dimensions.get('window').width,
    marginTop: Dimensions.get('window').width / 4,
  },
  userName: {
    fontSize: 24,
    color: COLORS.WHITE,
    marginTop: 10,
  },
  incomingCallText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.WHITE,
    marginTop: 5,
  },
  titleText: {
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#ffffff',
  },
  swipeText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontStyle: 'italic',
  },
  callAnswerButton: {
    height: 70,
    width: 70,
    borderRadius: Dimensions.get('window').width,
    backgroundColor: COLORS.GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callDropButton: {
    height: 70,
    width: 70,
    borderRadius: Dimensions.get('window').width,
    backgroundColor: COLORS.RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callImage: {
    height: 30,
    width: 30,
  },
});

export default styles;
