import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
import {COLORS, textStyles} from '../../styles/styles';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    marginBottom: 100,
  },
  searchHeader: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  search: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  tabNavigation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 2,
  },
  tabNavigationObject: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SECONDARY_TRANSPARENT,
  },
  tabNavigationObjectSelected: {
    borderBottomWidth: 3,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
  },
  tabNavigationText: {
    ...textStyles.paragraphLarge,
    color: COLORS.SECONDARY_TRANSPARENT,
    borderBottomWidth: 1,
    borderColor: COLORS.TRANSPARENT,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  tabNavigationTextSelected: {
    ...textStyles.paragraphLarge,
    borderColor: COLORS.TRANSPARENT,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 15,
    color: COLORS.PRIMARY,
  },

  searchInputFull: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginTop: 20,

    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 4,
  },
  searchInputText: {
    width: '100%',
    color: '#000',
    paddingHorizontal: 20,
    zIndex: 4,
    fontSize: 18,
  },
  suggestionDropdown: {
    position: 'absolute',
    width: '100%',
    maxHeight: 0.6 * height,

    top: 74,
    left: 20,

    paddingHorizontal: 20,

    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderColor: '#707070',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,

    zIndex: 2,
  },
  suggestionText: {
    marginVertical: 15,
    color: '#666',
    fontSize: 14,
  },
  searchHeaderText: {
    marginTop: 15,
    color: '#000',
  },
  searchResult: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    width,
    height: height - 480,
    justifyContent: 'center',
    flex: 1,
    marginTop: 120,
  },
  emptyImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    resizeMode: 'contain',
  },
  emptyText: {
    color: '#666',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 80,
    width: '100%',
  },
});

export default styles;
