import {Dimensions, StyleSheet} from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  max: {
    flex: 1,
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
  },
  remoteContainer: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remote: {
    width: 150,
    height: 200,
    marginHorizontal: 2.5,
    marginVertical: 50,
    position: 'absolute',
  },
  others: {
    width: dimensions.width,
    height: dimensions.height,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});