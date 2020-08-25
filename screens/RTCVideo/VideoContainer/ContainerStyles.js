import {Dimensions, StyleSheet} from 'react-native';
import {textStyles} from '../../../styles/styles';

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
    backgroundColor: '#FFF',
  },
  endCallButton: {
    backgroundColor: '#f00',
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
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
  endButtonText: {
    color: '#FFF',
  },
  buttonText: {
    color: '#666',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
    backgroundColor: '#000',
    alignItems: 'flex-end',
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
  remoteOverlay: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
  },
  overlayButton: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 15,
  },
  overlayButtonText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphMediumBold,
  },
  overlayText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphMediumBold,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});
