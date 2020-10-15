import React, {useContext, useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, StyleSheet, View} from 'react-native';
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
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(uri);
  const webViewRef = useRef(null);

  const [sessionId, setSessionId] = useState();
  const [loadProgress, setLoadProgress] = useState(0);

  const backButtonHandler = () => {
    if (canGoBack) webViewRef.current?.goBack();
  };

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
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
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
        onLoadProgress={({nativeEvent}) =>
          setLoadProgress(nativeEvent.progress)
        }
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setCurrentUrl(navState.url);
          addToSession(navState.url, sessionId);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height: height,
    backgroundColor: COLORS.WHITE,
  },
  webView: {
    flex: 1,
  },
});
