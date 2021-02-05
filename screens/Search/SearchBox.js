import React, {createRef, useState} from 'react';
import {View, TextInput, ToastAndroid} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import styles from './Styles';
import Dropdown from './Dropdown';
import {COLORS} from '../../styles/styles';
import {partialSearchDelayed} from './controllers';
const placeholder = 'Where do you want to visit today...';

export default ({fullSearch, autoFocus}) => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdown] = useState(false);
  const inputBox = createRef();

  const clearPartialSearchResults = () => {
    inputBox.current?.blur();
    setSuggestions([]);
    setText('');
    setDropdown(false);
  };

  const handleTextChange = async (query) => {
    setText(query);
    partialSearchDelayed(query)
      .then((response) => {
        setDropdown(true);
        setSuggestions(response);
      })
      .catch((e) => ToastAndroid.show(e), ToastAndroid.SHORT);
  };

  const ClearButton = () => (
    <TouchableWithoutFeedback
      style={{backgroundColor: 'red'}}
      onPress={() => {
        clearPartialSearchResults();
      }}>
      {inputBox.current?.isFocused() ? (
        <Icon name="close" size={24} color="#666" />
      ) : (
        <View style={{width: 24}}></View>
      )}
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.search}>
      <View style={styles.searchInputFull}>
        <Icon name="search" size={24} color="#666" />
        <TextInput
          autoCapitalize="none"
          autoCompleteType="off"
          autoFocus={autoFocus}
          style={styles.searchInputText}
          value={text}
          onChangeText={(query) => handleTextChange(query)}
          onSubmitEditing={() => {
            fullSearch(text);
            clearPartialSearchResults();
          }}
          returnKeyType="search"
          blurOnSubmit={true}
          placeholder={placeholder}
          placeholderTextColor={COLORS.BORDER}
          ref={inputBox}
        />
        <ClearButton />
      </View>
      <Dropdown
        fullSearch={(text) => {
          fullSearch(text);
          clearPartialSearchResults();
        }}
        dropdownOpen={dropdownOpen}
        suggestions={suggestions}
      />
    </View>
  );
};
