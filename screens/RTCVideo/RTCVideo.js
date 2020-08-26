import React, {useState, useEffect} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import VideoContainer from './VideoContainer/VideoContainer';
import requestCameraAndAudioPermission from './VideoContainer/Permissions';
const appId = 'de22f355862e48539cb856e69aa4d557';
export default (props) => {
  const {channelName} = props.route.params || {channelName: 'test'};
  const [permission, setPermissionStatus] = useState(false);

  useEffect(() => {
    console.log({channelName});
    requestCameraAndAudioPermission().then((granted) => {
      if (granted) setPermissionStatus(true);
      else console.log('Permissions not granted');
    });
  }, []);

  return permission && channelName && channelName.length > 0 ? (
    <VideoContainer channelName={channelName} appId={appId} />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color="#0062FF" size="large" />
      <Text style={{paddingTop: 20}}>Trying to find the channel</Text>
    </View>
  );
};
