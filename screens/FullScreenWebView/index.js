import React, {useContext, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import ProgressBar from '../../components/ProgressBar';
import {Post} from '../../api/http';
import {GlobalContext} from '../../providers/GlobalContext';
import {COLORS} from '../../styles/styles';

const {height} = Dimensions.get('window');
const sessionURL = 'app/tracker/history/session';

export default ({route}) => {
  const {uri} = route.params;
  const {state} = useContext(GlobalContext);
  const webViewRef = useRef();

  const [sessionId, setSessionId] = useState();
  const [loadProgress, setLoadProgress] = useState(0);

  const generateSession = async () => {
    try {
      const body = JSON.stringify({
        cred: {
          phone: state.user.phone,
        },
      });
      const response = await Post(`${sessionURL}/start`, body);
      setSessionId(response.sessionId);
      addToSession(uri, response.sessionId);
    } catch (e) {
      console.error(e);
    }
  };

  const addToSession = async (url, sessionId) => {
    try {
      const body = JSON.stringify({
        sessionId,
        url,
      });
      await Post(`${sessionURL}/add`, body);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generateSession();
  }, []);

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
          if (!nativeEvent.loading) {
            console.log({nativeEvent});
            addToSession(nativeEvent.url, sessionId);
          }
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
