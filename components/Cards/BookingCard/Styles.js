import { StyleSheet, Dimensions } from 'react-native';
import { textStyles, COLORS } from '../../../styles/styles';

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - 40,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    elevation: 3,
    zIndex: 0,
  },
  mainCard: {
    flex: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  dateContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  date: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmallBold,
  },
  imageContainer: {
    flex: 2,
    marginLeft: 20,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  details: {
    flex: 5,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  header: {
    ...textStyles.paragraphLarge,
    color: COLORS.SECONDARY,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...textStyles.paragraphSmall,
    color: COLORS.SECONDARY,
    marginLeft: 10,
  },
  extension: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    width: '100%',
    paddingVertical: 10,
  },
  extensionTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRightWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  extensionTab2: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    paddingRight: 50,
    borderRightWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  extensionTabLast: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  tabText: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
});

export default styles;