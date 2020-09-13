import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from './Styles';

export default () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require('../../components/UXComponents/svg/EmptyPage.png')}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyText}>Nothing here!</Text>
  </View>
);
