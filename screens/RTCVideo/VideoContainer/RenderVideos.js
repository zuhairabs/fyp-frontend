import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {RtcRemoteView, RtcLocalView, VideoRenderMode} from 'react-native-agora';
import styles from './ContainerStyles';
import RemoteOverlay from './RemoteOverlay';

const remoteName = 'Nike Palladium';
const remoteTitle = 'Store Manager';

export const RenderVideos = ({
  joinSucceed = false,
  channelName,
  peerIds,
  overlayFunctions,
  localSettings,
}) => {
  return joinSucceed ? (
    <View style={styles.fullView}>
      <RtcLocalView.SurfaceView
        style={styles.localVideo}
        channelId={channelName}
        renderMode={VideoRenderMode.Hidden}
        zOrderMediaOverlay={true}
      />
      <RenderRemoteVideos
        peerIds={peerIds}
        channelName={channelName}
        overlayFunctions={overlayFunctions}
        localSettings={localSettings}
      />
    </View>
  ) : null;
};

const RenderRemoteVideos = ({
  peerIds,
  channelName,
  overlayFunctions,
  localSettings,
}) => {
  const [timeSeconds, setTimeElapsed] = useState(0);
  const overlayOpacity = useState(new Animated.Value(0))[0];
  const [overlayVisible, setOverlayVisibility] = useState(false);

  const tickCallTimer = () =>
    setInterval(() => setTimeElapsed((prev) => ++prev), 1000);

  useEffect(() => {
    tickCallTimer();
  }, []);

  const changeOverlayOpacity = (opacity) => {
    Animated.timing(overlayOpacity, {
      toValue: opacity,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setOverlayVisibility(opacity === 1 ? true : false));
  };

  const toggleOverlay = () => {
    changeOverlayOpacity(overlayVisible ? 0 : 1);
  };

  return (
    <>
      <ScrollView
        horizontal={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}>
        {peerIds.map((value, index, array) => {
          return (
            <TouchableWithoutFeedback onPress={() => toggleOverlay()}>
              <RtcRemoteView.SurfaceView
                style={styles.remoteVideo}
                uid={value}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
              />
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
      <RemoteOverlay
        time={timeSeconds}
        title={remoteTitle}
        name={remoteName}
        overlayFunctions={overlayFunctions}
        localSettings={localSettings}
        overlayOpacity={overlayOpacity}
        toggleOverlay={toggleOverlay}
      />
    </>
  );
};
