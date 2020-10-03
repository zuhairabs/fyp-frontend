import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {COLORS} from '../../styles/styles';
const DEVICE_HEIGHT = Dimensions.get('screen').height;

export default ({route}) => {
  const {uri} = route.params;
  const webViewRef = useRef();

  return (
    <View style={styles.screenContainer}>
      <WebView
        source={{uri}}
        scrollEnabled={true}
        pullToRefreshEnabled={true}
        style={styles.webView}
        ref={webViewRef}
        onLoad={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;
          console.log(nativeEvent.url);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    minHeight: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  webView: {
    flex: 1,
  },
});
