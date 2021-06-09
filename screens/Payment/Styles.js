import { StyleSheet, Dimensions} from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('screen').height;
const WINDOW_WIDTH = Dimensions.get('screen').width;

export default styles = StyleSheet.create({
  innerContainer: {
    height: WINDOW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white'
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  infoContainer: {
    // height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Math.floor(WINDOW_WIDTH / 20),
    // borderWidth: 2
  },
  infoMessage: {
    // borderWidth: 2,
    marginTop: Math.floor(WINDOW_WIDTH / 20),
    fontSize: 16,
    width: Math.floor(WINDOW_WIDTH / 1.2),
    textAlign: 'center'
  },
  options: {
    flexDirection: 'row',
    width: Math.floor(WINDOW_WIDTH / 1.2),
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    paddingLeft: Math.floor(WINDOW_WIDTH / 20),
    paddingTop: Math.floor(WINDOW_WIDTH / 60),
    marginBottom: -Math.floor(WINDOW_WIDTH / 30),
  },
})