import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './ContainerStyles';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export const BottomButton = ({iconName, onPressFunction}) => (
  <TouchableOpacity
    onPress={() => {
      onPressFunction();
    }}
    style={styles.button}>
    <Text style={styles.buttonText}>
      <Icon name={iconName} size={24} />
    </Text>
  </TouchableOpacity>
);

export const EndCallButton = ({onPressFunction}) => (
  <TouchableOpacity
    onPress={() => onPressFunction()}
    style={styles.endCallButton}>
    <View style={styles.endCallButtonInner}>
      <Icon name="call-end" size={24} color="#FFF" />
    </View>
  </TouchableOpacity>
);
