import { StyleSheet, Dimensions, StatusBar } from 'react-native';

import { COLORS } from '../../styles/styles';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: WINDOW_HEIGHT,
  },
  innerContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    padding: Math.floor(WINDOW_WIDTH / 30),
    marginTop: -30,
    justifyContent: 'flex-start',
  },
  navbar: {
    flexDirection: 'row',
    padding: Math.floor(WINDOW_WIDTH / 30),
    alignItems: 'flex-start'
  },
  pagetitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingLeft: Math.floor(WINDOW_WIDTH / 20),
  },
  event: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Math.floor(WINDOW_WIDTH / 20),
    padding: Math.floor(WINDOW_WIDTH / 20),
  },
  product: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Math.floor(WINDOW_WIDTH / 3),
    height: Math.floor(WINDOW_WIDTH / 3),
    borderRadius: Math.floor(WINDOW_WIDTH / 20),
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Math.floor(WINDOW_WIDTH / 1.3),
    marginTop: Math.floor(3 * WINDOW_WIDTH / 20),
  },
  starttime: {
    alignItems: 'center',
    padding: Math.floor(WINDOW_WIDTH / 30),
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    width: Math.floor(WINDOW_WIDTH / 3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  endtime: {
    alignItems: 'center',
    padding: Math.floor(WINDOW_WIDTH / 30),
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    width: Math.floor(WINDOW_WIDTH / 3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.62,

    elevation: 4,
  },
  feedback: {
    marginTop: Math.floor(WINDOW_WIDTH / 25),
    padding: Math.floor(WINDOW_WIDTH / 45),
  },
  params: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '3%',
    // borderWidth: 1
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '8%',
    // borderWidth: 1
  },
  paramText: {
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    flex: 1,
    alignContent: 'center',
    color: '#000',
    paddingLeft: Math.floor(WINDOW_WIDTH / 20),
  },
  submit: {
    width: Math.floor(WINDOW_WIDTH / 2),
    height: Math.floor(WINDOW_WIDTH / 10),
    backgroundColor: '#0063ff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    color: 'white',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: Math.floor(WINDOW_WIDTH / 6),
  },
  yesContainer: {
    width: 52,
    height: 24,
    backgroundColor: '#0063ff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'white',
    borderRadius: 6,
    alignSelf: 'center',
  },
  noContainer: {
    width: 52,
    height: 24,
    backgroundColor: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#0063ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0063ff',
    alignSelf: 'center',
  }
})

export default styles;