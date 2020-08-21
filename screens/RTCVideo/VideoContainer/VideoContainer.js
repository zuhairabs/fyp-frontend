import React, {useState, useEffect} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  RtcLocalView,
  VideoRenderMode,
} from 'react-native-agora';

import requestCameraAndAudioPermission from './Permissions';
import styles from './ContainerStyles';

export default () => {
  const [appId] = useState('iajdfkdjiofeadksdkjahfudkjfd');
  const [channelName] = useState('diefoidsa');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [_engine, setEngine] = useState();

  const init = async () => {
    console.log('Inside init');
    await _engine.enableVideo();
    _engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // check for new user
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds((prev) => {
          return [...prev, uid];
        });
      }
    });
    _engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      setPeerIds((prev) => {
        return prev.filter((id) => id !== uid);
      });
    });

    _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      setJoinSucceed(true);
    });
  };

  const startCall = async () => {
    await _engine?.joinChannel(null, channelName, null, 0);
  };

  const endCall = async () => {
    await _engine?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  };

  useEffect(() => {
    if (Platform.OS === 'android')
      requestCameraAndAudioPermission().then(async (granted) => {
        const engine = await RtcEngine.create(appId);
        setEngine(engine);
        if (granted) init();
        else console.log('Permissions not granted');
      });
  }, []);

  const RenderVideos = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        <RenderRemoteVideos />
      </View>
    ) : null;
  };

  const RenderRemoteVideos = () => {
    return (
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
  };

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
