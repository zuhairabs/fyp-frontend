/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { View, ToastAndroid, BackHandler, StyleSheet, Alert } from 'react-native';
import RtcEngine, { ChannelProfile, ClientRole } from 'react-native-agora';
import RenderLiveVideo from './RenderLiveVideo';
import KeepAwake from 'react-native-keep-awake';
import LiveStreamOverlay from './LiveStreamOverlay';
import { navigationRef } from '../../../Navigation/Navigation';

export default ({ channelName, appId, uid, product, event }) => {
  const _engine = RtcEngine.create(appId);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [callended, setCallended] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  // RTC functions
  const startCall = async () =>
    (await _engine).joinChannel(null, channelName, null, uid);

  const endCall = async () => {
    (await _engine).leaveChannel();
    (await _engine).destroy();
    setPeerIds([]);
    setJoinSucceed(false);
    console.log('LeaveChannelSuccess', { channelName });
    navigationRef.current.goBack();
  };

  const backAction = async () => {
    await Alert.alert('Are you sure you want to leave?', '', [
      {
        text: 'Yes',
        onPress: () => {
          endCall();
        },
        style: 'cancel',
      },
      { text: 'No', onPress: () => null },
    ]);
  };

  const overlayFunctions = { backAction };
  // RTC listeners
  const init = async () => {
    (await _engine).enableVideo(); // enabling host video
    startCall();
    // Set the channel profile as live streaming.
    (await _engine).setChannelProfile(ChannelProfile.LiveBroadcasting);
    // Set the usr role as audience
    (await _engine).setClientRole(ClientRole.Audience);

    (await _engine).addListener('UserJoined', (uid, elapsed) => {
      console.log('HostJoined', { uid, elapsed });
      // check for new user
      if (peerIds.indexOf(uid) === -1) setPeerIds([...peerIds, uid]);
    });
    // Callback for stream type switching
    (await _engine).addListener(
      'RemoteSubscribeFallbackToAudioOnly',
      (uid, isFallbackOrRecover) => {
        if (isFallbackOrRecover) {
          console.log('Switching to audio, poor connectivity of host'); //confirmation
          ToastAndroid.show(
            'Switching to audio, poor connectivity of host',
            ToastAndroid.SHORT,
          );
        } else {
          ToastAndroid.show('Switching back to video stream', ToastAndroid.SHORT);
          console.log('switching back to video stream'); //confirmation
        }
      },
    );
    (await _engine).addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', { uid, reason });
      setPeerIds((prev) => {
        return prev.filter((id) => id !== uid);
      });
      // user left explicitly
      if (reason === 0 && !callended) {
        setCallended(true);
      }
      // user left channel due to intrnet issue
      if (reason === 1) {
        ToastAndroid.show(
          'Connectivity issues from store side, please be patient.',
          ToastAndroid.SHORT,
        );
      }
    });
    (await _engine).setRemoteSubscribeFallbackOption(2);
    (await _engine).addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', { channel, uid, elapsed });
        setJoinSucceed(true);
      },
    );
  };

  useEffect(() => {
    let isMounted = true;
    BackHandler.addEventListener('hardwareBackPress', backAction);
    console.log({ uid });
    if (_engine && isMounted) {
      init();
    }
    if (callended) {
      endCall();
      ToastAndroid.show('Store ended the call', ToastAndroid.SHORT);
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
      isMounted = false;
    };
  }, [callended]);

  return (
    <View style={styles.max}>
      <RenderLiveVideo
        joinSucceed={joinSucceed}
        peerIds={peerIds}
        channelName={channelName}
      />
      <LiveStreamOverlay channelName={channelName} product={product} event={event} overlayFunctions={overlayFunctions} />
      <KeepAwake />
    </View>
  );
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 5,
    borderColor: 'transparent',
  },
});
