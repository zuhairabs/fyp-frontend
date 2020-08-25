import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import RtcEngine from 'react-native-agora';
import {navigationRef} from '../../../Navigation/Navigation';

import styles from './ContainerStyles';
import {BottomButton, EndCallButton} from './Controls';
import {RenderVideos} from './RenderVideos';

export default ({channelName, appId}) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  // RTC functions
  const startCall = async () =>
    (await _engine).joinChannel(null, channelName, null, 0);

  const endCall = async () => {
    (await _engine).leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
    console.log('LeaveChannelSuccess', channelName);
  };

  // RTC listeners
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

  return (
    <View style={styles.max}>
      <RenderVideos
        joinSucceed={joinSucceed}
        peerIds={peerIds}
        channelName={channelName}
      />
      <View style={styles.buttonHolder}>
        <BottomButton iconName="textsms" onPressFunction={() => {}} />
        <EndCallButton
          onPressFunction={() => {
            endCall();
            navigationRef.current.goBack();
          }}
        />
        <BottomButton iconName="camera-front" onPressFunction={() => {}} />
      </View>
    </View>
  );
};
