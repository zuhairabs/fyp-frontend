import React from 'react';
import {Text, ScrollView, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './Styles';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const getDropDownStyles = (dropdownOpen) => ({
  borderWidth: 1,
  maxHeight: dropdownOpen ? 0.6 * DEVICE_HEIGHT : 0,
});

export default ({dropdownOpen, fullSearchStore, suggestions}) => (
  <ScrollView
    style={{...styles.suggestionDropdown, ...getDropDownStyles(dropdownOpen)}}>
    {suggestions.map((result, index) => (
      <TouchableOpacity
        onPress={() => {
          fullSearchStore(result.name);
        }}
        key={index}>
        <Text style={styles.suggestionText}>{result.name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);
