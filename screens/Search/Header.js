import React from 'react';
import {View, Text} from 'react-native';
import styles from './Styles';

export default ({query}) => (
  <View style={styles.searchHeader}>
    {query ? (
      <Text style={styles.searchHeaderText}>
        Search results for
        <Text style={{color: '#0062FF'}}> '{query}'</Text>
      </Text>
    ) : (
      <Text style={styles.searchHeaderText}>Your recent searches</Text>
    )}
  </View>
);
