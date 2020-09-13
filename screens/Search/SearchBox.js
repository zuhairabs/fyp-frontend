import React from 'react';
import {View, TextInput} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import styles from './Styles';
import Dropdown from './Dropdown';
const placeholder = 'Where do you want to visit today...';

export default ({
  handleTextChange,
  clearPartialSearchResults,
  fullSearchStore,
  dropdownOpen,
  suggestions,
  inputBox,
  autoFocus,
  text,
}) => (
  <View style={styles.search}>
    <View style={styles.searchInputFull}>
      <Icon name="search" size={24} color="#666" />
      <TextInput
        autoCapitalize="none"
        autoCompleteType="off"
        autoFocus={autoFocus}
        style={styles.searchInputText}
        value={text}
        onChangeText={(query) => {
          handleTextChange(query);
        }}
        placeholder={placeholder}
        onBlur={() => {
          clearPartialSearchResults();
        }}
        blurOnSubmit={true}
        placeholderTextColor="#707070"
        ref={inputBox}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          clearPartialSearchResults();
        }}>
        {inputBox.current?.isFocused() ? (
          <Icon name="close" size={24} color="#666" />
        ) : (
          <View style={{width: 24}}></View>
        )}
      </TouchableWithoutFeedback>
    </View>
    <Dropdown
      fullSearchStore={fullSearchStore}
      dropdownOpen={dropdownOpen}
      suggestions={suggestions}
    />
  </View>
);
