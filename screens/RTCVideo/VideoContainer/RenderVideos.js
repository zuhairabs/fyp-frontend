import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {RtcRemoteView, RtcLocalView, VideoRenderMode} from 'react-native-agora';
import styles from './ContainerStyles';
import RemoteOverlay from './RemoteOverlay';

const remoteName = 'John Doe';
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

  const tickTimer = () =>
    setInterval(() => {
      setTimeElapsed((prev) => ++prev);
    }, 1000);
  useEffect(() => {
    tickTimer();
  }, []);

  return (
    <>
      <ScrollView
        horizontal={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}>
        {peerIds.map((value, index, array) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remoteVideo}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
            />
          );
        })}
      </ScrollView>
      <RemoteOverlay
        time={timeSeconds}
        title={remoteTitle}
        name={remoteName}
        overlayFunctions={overlayFunctions}
        localSettings={localSettings}
      />
    </>
  );
};
