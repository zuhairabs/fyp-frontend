import {StyleSheet, Platform, StatusBar, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
    height: '100%',
  },
  searchHeader: {
    paddingHorizontal: 20,
  },
  search: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
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
