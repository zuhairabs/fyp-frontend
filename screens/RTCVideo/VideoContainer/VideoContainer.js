import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import RtcEngine from 'react-native-agora';
import {navigationRef} from '../../../Navigation/Navigation';
import styles from './ContainerStyles';
import {BottomButton, EndCallButton} from './Controls';
import {RenderVideos} from './RenderVideos';

const generateRandomUid = () => Math.floor(Math.random() * 100);

export default ({channelName, appId}) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [uid] = useState(generateRandomUid());
  const [localAudio, setLocalAudio] = useState(true);
  const [localVideo, setLocalVideo] = useState(true);

  // Video controls
  const toggleCameraView = async () => (await _engine).switchCamera();

  const toggleLocalVideo = async () => {
    const isMuted = !localVideo;
    (await _engine).muteLocalVideoStream(!isMuted);
    setLocalVideo((prev) => !prev);
  };

  const toggleLocalAudio = async () => {
    const isMuted = !localAudio;
    (await _engine).muteLocalAudioStream(!isMuted);
    setLocalAudio((prev) => !prev);
  };

  const overlayFunctions = {toggleLocalAudio, toggleLocalVideo};
  const localSettings = {localAudio, localVideo};

  // RTC functions
  const startCall = async () =>
    (await _engine).joinChannel(null, channelName, null, uid);

  const endCall = async () => {
    (await _engine).leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
    console.log('LeaveChannelSuccess', {channelName});
  };

  // RTC listeners
  const init = async () => {
    console.log('Inside init');
    (await _engine).enableVideo();
    startCall();
    (await _engine).addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', {uid, elapsed});
      // check for new user
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds((prev) => {
          return [...prev, uid];
        });
      }
    });
    (await _engine).addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', {uid, reason});
      setPeerIds((prev) => {
        return prev.filter((id) => id !== uid);
      });
    });

    (await _engine).addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', {channel, uid, elapsed});
        setJoinSucceed(true);
      },
    );
  };

  useEffect(() => {
    console.log({uid});
    if (_engine) init();
  }, []);

  return (
    <View style={styles.max}>
      <RenderVideos
        joinSucceed={joinSucceed}
        peerIds={peerIds}
        channelName={channelName}
        overlayFunctions={overlayFunctions}
        localSettings={localSettings}
      />
      <View style={styles.buttonHolder}>
        <BottomButton iconName="textsms" onPressFunction={() => {}} />
        <EndCallButton
          onPressFunction={() => {
            endCall();
            navigationRef.current.goBack();
          }}
        />
        <BottomButton
          iconName="camera-front"
          onPressFunction={() => toggleCameraView()}
        />
      </View>
    </View>
  );
};
