import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import LiveStreamContainer from './VideoContainer/LiveStreamContainer';
import requestCameraAndAudioPermission from './VideoContainer/Permissions';
import { generateRandomUid, appId } from './Controllers/Connection';
import { GlobalContext } from '../../providers/GlobalContext';
import { Post } from '../../api/http';

export default ({ route }) => {
  console.log('Data from LiveStream.js ==>', route.params);
  const { state } = useContext(GlobalContext);
  const { channelName } = route.params;
  const { event } = route.params;
  const [uid] = useState(generateRandomUid());
  const [permission, setPermissionStatus] = useState(false);
  const [response, setResponse] = useState({});

  const onFocus = async () => {
    await requestCameraAndAudioPermission().then((granted) => {
      if (granted) {
        let uri = 'demoBooking/actions/joindemocall';
        const body = JSON.stringify({
          cred: {
            phone: state.user.phone,
          },
          event: event,
          user: state.user._id,
        });
        Post(uri, body, state.token).then((data) => {
          console.log("Livestream ==> ", data);
          setResponse(data);
          setPermissionStatus(true);
        });
      } else console.log('Permissions not granted');
    });
  };

  useEffect(() => {
    console.log("Livestream ==> ", channelName);
    onFocus();
  }, []);

  return permission && channelName && channelName.length > 0 ? (
    <LiveStreamContainer
      channelName={channelName}
      appId={appId}
      uid={uid}
      product={response}
      event={event}
    />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color="#0062FF" size="large" />
      <Text style={{ paddingTop: 20 }}>Connecting....</Text>
    </View>
  );
};
