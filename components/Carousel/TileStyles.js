import {StyleSheet, Dimensions} from 'react-native';
import {textStyles, COLORS} from '../../styles/styles';
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,

    justifyContent: 'center',
    alignItems: 'center',

    height: 220,
    width: DEVICE_WIDTH,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    elevation: 8,
    borderRadius: 12,

    height: 200,
    width: DEVICE_WIDTH - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 10,
  },
  cardLeft: {
    paddingVertical: 24,
    paddingLeft: 16,
    paddingRight: 8,
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    justifyContent: 'space-around',
  },
  cardTitleText: {
    color: '#1162FB',
    ...textStyles.bigCardHeading,
  },
  cardTitleTextBlack: {
    color: '#000',
    ...textStyles.bigCardHeading,
  },
  cardTitleSubtext: {
    textTransform: 'uppercase',
    fontFamily: 'notoserif',
    fontSize: 10,
  },
  cardRight: {
    width: '100%',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: undefined,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default styles;
