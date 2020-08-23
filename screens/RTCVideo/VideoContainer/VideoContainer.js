import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  RtcLocalView,
  VideoRenderMode,
} from 'react-native-agora';
import styles from './ContainerStyles';

export default ({channelName, appId}) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  const startCall = async () => {
    console.log(_engine);
    (await _engine).joinChannel(null, channelName, null, 0);
  };

  const endCall = async () => {
    (await _engine).leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
    console.log('LeaveChannelSuccess', channelName);
  };

  const init = async () => {
    console.log('Inside init');
    (await _engine).enableVideo();
    (await _engine).addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // check for new user
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds((prev) => {
          return [...prev, uid];
        });
      }
    });
    (await _engine).addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      setPeerIds((prev) => {
        return prev.filter((id) => id !== uid);
      });
    });

    (await _engine).addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoinSucceed(true);
      },
    );
  };

  useEffect(() => {
    if (_engine) init();
  }, []);

  const RenderVideos = () =>
    joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        <RenderRemoteVideos />
      </View>
    ) : null;

  const RenderRemoteVideos = () => (
    <ScrollView
      style={styles.remoteContainer}
      contentContainerStyle={{paddingHorizontal: 2.5}}
      horizontal={true}>
      {peerIds.map((value, index, array) => {
        return (
          <RtcRemoteView.SurfaceView
            style={styles.remote}
            uid={value}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            onPress={() => {
              startCall();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              endCall();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        <RenderVideos />
      </View>
    </View>
  );
};
