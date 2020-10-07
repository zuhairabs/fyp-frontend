import React, {useState, useEffect, createRef} from 'react';
import {View} from 'react-native';
import RtcEngine from 'react-native-agora';
import {navigationRef} from '../../../Navigation/Navigation';
import styles from './ContainerStyles';
import {BottomButton, EndCallButton} from './Controls';
import {RenderVideos} from './RenderVideos';
import ChatBox from '../Chat/Chat';
import RBSheet from 'react-native-raw-bottom-sheet';

export const chatBoxRef = createRef();

export default ({channelName, appId, uid}) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [localAudio, setLocalAudio] = useState(true);
  const [localVideo, setLocalVideo] = useState(true);

  // Video controls
  const openChatBox = async () => chatBoxRef.current?.open();
  const closeChatBox = async () => chatBoxRef.current?.close();
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

  const getVideoAggregateTime = async () =>
    (await _engine).getUserInfoByUid(uid);

  const endCall = async () => {
    (await _engine).leaveChannel();
    (await _engine).destroy();
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
      if (peerIds.indexOf(uid) === -1) setPeerIds([uid]);
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
      <RBSheet
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        dragFromTopOnly={true}
        animationType="slide"
        customStyles={{
          container: styles.bottomSheetContainer,
          wrapper: styles.bottomSheetWrapper,
          draggableIcon: styles.bottomSheetDraggableIcon,
        }}
        ref={chatBoxRef}>
        <ChatBox closeChatBox={closeChatBox} channel={channelName} />
      </RBSheet>
      <View style={styles.buttonHolder}>
        <BottomButton
          iconName="textsms"
          onPressFunction={() => openChatBox()}
        />
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
