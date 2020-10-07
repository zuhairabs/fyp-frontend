import {StyleSheet} from 'react-native';
import {COLORS, textStyles} from '../../../styles/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  headerTitle: {
    ...textStyles.paragraphLarge,
    color: COLORS.WHITE,
  },
  statusLight: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: COLORS.GREEN,
  },
  body: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
