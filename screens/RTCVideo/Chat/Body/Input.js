import React from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import styles from '../Styles';

const Input = ({text, setText, sendMessage, setKeyboardEnabled}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.inputBox}
      placeholder="Send a message"
      returnKeyType="send"
      value={text}
      onChangeText={(val) => setText(val)}
      onSubmitEditing={() => sendMessage()}
      onFocus={() => setKeyboardEnabled(true)}
      onBlur={() => setKeyboardEnabled(false)}
    />
  </View>
);

export default Input;
