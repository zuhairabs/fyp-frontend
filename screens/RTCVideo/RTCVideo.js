import React, {useState, useEffect, useContext} from 'react';
import {Text, View, ActivityIndicator, AsyncStorage} from 'react-native';
import VideoContainer from './VideoContainer/VideoContainer';
import requestCameraAndAudioPermission from './VideoContainer/Permissions';
import {ongoingCall} from '../../controllers/Notifications/pushNotification';
import {
  registerNewParticipant,
  generateRandomUid,
  appId,
} from './Controllers/Connection';
import {GlobalContext} from '../../providers/GlobalContext';

export default ({route}) => {
  const {state} = useContext(GlobalContext);
  const {channelName} = route.params;
  const [uid] = useState(generateRandomUid());
  const [permission, setPermissionStatus] = useState(false);

  const clearStorage = async () =>{
    await AsyncStorage.setItem('callDetails', "");
  }

  useEffect(() => {
    clearStorage();
    console.log({channelName});
    requestCameraAndAudioPermission().then((granted) => {
      if (granted) {
		  ongoingCall(channelName);
        registerNewParticipant(state.user._id, channelName, uid).then(() =>
          setPermissionStatus(true),
        );
      } else console.log('Permissions not granted');
    });
  }, []);

  return permission && channelName && channelName.length > 0 ? (
    <VideoContainer channelName={channelName} appId={appId} uid={uid} />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color="#0062FF" size="large" />
      <Text style={{paddingTop: 20}}>Connecting....</Text>
    </View>
  );
};
