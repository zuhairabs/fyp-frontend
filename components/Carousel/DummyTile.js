import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import styles from './TileStyles';

export const DummyTile = () => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={styles.card}>
        <View style={styles.cardLeft}>
          <ActivityIndicator />
        </View>
        <View style={styles.cardRight} />
      </TouchableWithoutFeedback>
    </View>
  );
};
