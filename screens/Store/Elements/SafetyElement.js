import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {styles} from '../Styles';

export default ({item}) => (
  <View style={styles.safetyElement}>
    <Icon name="check" size={12} color="#4DEB96" />
    <Text style={styles.safetyElementText}>{item.title}</Text>
  </View>
);
