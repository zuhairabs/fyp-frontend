import {StyleSheet, StatusBar, Platform, Dimensions} from 'react-native';
import {COLORS} from '../../../styles/styles';
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: WINDOW_HEIGHT,
  },
  contentContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 100,
  },
  bookingData: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderColor: COLORS.SECONDARY_TRANSPARENT,
  },
  qrContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 50,
  },
});

export default styles;
