import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  RtcLocalView,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import styles from './ContainerStyles';
import {navigationRef} from '../../../Navigation/Navigation';

export default ({channelName, appId}) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  const startCall = async () => {
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
    startCall();
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
          style={styles.remote}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
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
            style={styles.fullView}
            uid={value}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <RenderVideos />
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.buttonText}>
              <Icon name="textsms" size={24} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              endCall();
              navigationRef.current?.goBack();
            }}
            style={styles.endCallButton}>
            <Text style={styles.endButtonText}>
              <Icon name="call-end" size={24} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.buttonText}>
              <Icon name="camera-front" size={24} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
