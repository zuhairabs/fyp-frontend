import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import ProgressBar from '../../components/ProgressBar';

import {COLORS} from '../../styles/styles';
const {height} = Dimensions.get('window');

export default ({route}) => {
  const {uri} = route.params;
  const [loadProgress, setLoadProgress] = useState(0);
  const webViewRef = useRef();

  return (
    <View style={styles.screenContainer}>
      <ProgressBar progress={loadProgress} />
      <WebView
        ref={webViewRef}
        source={{uri}}
        style={styles.webView}
        scrollEnabled
        pullToRefreshEnabled
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        onLoad={({nativeEvent}) => {
          if (!nativeEvent.loading) console.log({nativeEvent});
        }}
        onLoadProgress={({nativeEvent}) =>
          setLoadProgress(nativeEvent.progress)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    minHeight: height,
    backgroundColor: COLORS.WHITE,
  },
  webView: {
    flex: 1,
  },
});
