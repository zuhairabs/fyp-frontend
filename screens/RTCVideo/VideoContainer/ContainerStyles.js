import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/styles';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  max: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
  },
  endCallButton: {
    backgroundColor: COLORS.WHITE,
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    borderWidth: 1,
    borderColor: COLORS.PINK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButtonInner: {
    backgroundColor: COLORS.PINK,
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 8,
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#666',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
    backgroundColor: '#000',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  localVideo: {
    width: 150,
    height: 200,
    top: 50,
    right: 30,
    position: 'absolute',
  },
  remoteVideo: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  bottomSheetWrapper: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  bottomSheetContainer: {
    height: Math.floor(dimensions.height / 1.3),
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
  },
});
