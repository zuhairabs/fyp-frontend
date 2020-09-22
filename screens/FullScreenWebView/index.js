import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {COLORS} from '../../styles/styles';
const DEVICE_HEIGHT = Dimensions.get('screen').height;

export default ({route}) => {
  const {uri} = route.params;
  return (
    <View style={styles.screenContainer}>
      <WebView
        source={{uri}}
        scrollEnabled={true}
        // startInLoadingState={true}
        pullToRefreshEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
});
