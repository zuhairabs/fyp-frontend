import {StyleSheet, Dimensions} from 'react-native';
import {textStyles, COLORS} from '../../../styles/styles';
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: Math.floor(DEVICE_WIDTH / 2.6),
    marginVertical: 8,
    marginRight: 10,
    marginLeft: 20,
    // marginHorizontal: 15,
  },
  card: {
    height: 272,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',

    elevation: 5,
    borderRadius: 15,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 134,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  cardSubtitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitleText: {
    color: '#666',
    flexWrap: 'wrap',
    flexDirection: 'row',
    ...textStyles.paragraphExtraSmall,
  },
  cardHeader: {
    width: '100%',
    height: 138,
  },
  cardImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: '-10%',
    bottom: '-6%',
    elevation: 5,
  },
});

export default styles;
