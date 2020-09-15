import React from 'react';
import {Text, Dimensions} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import styles from './Styles';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const getDropDownStyles = (dropdownOpen) => ({
  borderWidth: dropdownOpen ? 1 : 0,
  maxHeight: dropdownOpen ? 0.6 * DEVICE_HEIGHT : 0,
});

export default ({dropdownOpen, fullSearch, suggestions}) => (
  <FlatList
    data={suggestions}
    renderItem={({item}) => (
      <TouchableOpacity onPress={() => fullSearch(item.name)}>
        <Text style={styles.suggestionText}>{item.name}</Text>
      </TouchableOpacity>
    )}
    style={{...styles.suggestionDropdown, ...getDropDownStyles(dropdownOpen)}}
  />
);
