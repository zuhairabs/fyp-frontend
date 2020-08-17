import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const SearchBarIdle = (props) => {
  const placeholder = 'Where do you want to visit today...';

  return (
    <View style={Styles.search}>
      <TouchableWithoutFeedback
        style={Styles.searchInput}
        onPress={() => {
          props.navigation.navigate('SearchFull', {
            initial: null,
            autoFocus: true,
          });
        }}>
        <Icon name="search" size={16} color="#666" />
        <Text style={Styles.dummyText}>{placeholder}</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const Styles = StyleSheet.create({
  search: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  searchInput: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    backgroundColor: '#fff',
    paddingHorizontal: 20,

    height: 50,

    borderColor: '#666',
    borderRadius: 8,
    elevation: 10,
    zIndex: 0,
  },
  dummyText: {
    padding: 15,
    color: '#66666666',
    backgroundColor: '#fff',
  },
});

export default SearchBarIdle;
