import React from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';

export default () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: Dimensions.get('window').height - 100,
      width: '100%',
    }}>
    <ActivityIndicator size="large" color="#0062FF" />
  </View>
);
