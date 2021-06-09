import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { RtcRemoteView, VideoRenderMode } from 'react-native-agora';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default RenderLiveVideos = ({
  joinSucceed = false,
  channelName,
  peerIds,
}) => {
  return joinSucceed ? (
    <View style={styles.fullView}>
      <RenderRemoteVideos peerIds={peerIds} channelName={channelName} />
    </View>
  ) : null;
};

const RenderRemoteVideos = ({ peerIds, channelName }) => {
  return (
    <>
      <ScrollView
        horizontal={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}>
        {peerIds.map((value, index, array) => {
          return (
            <>
              <RtcRemoteView.SurfaceView
                style={styles.remoteVideo}
                uid={value}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
                key={index}
              />
            </>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: '#000',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  remoteVideo: {
    width: dimensions.width,
    height: dimensions.height,
  },
});