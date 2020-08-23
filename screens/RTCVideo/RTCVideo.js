import React, {useEffect, useState} from 'react';
import {} from 'react-native';

import VideoContainer from './VideoContainer/VideoContainer';
import requestCameraAndAudioPermission from './VideoContainer/Permissions';
const appId = 'de22f355862e48539cb856e69aa4d557';
const channelName = 'demo';

export default () => {
  const [permission, setPermissionStatus] = useState(false);
  useEffect(() => {
    requestCameraAndAudioPermission().then((granted) => {
      if (granted) setPermissionStatus(true);
      else console.log('Permissions not granted');
    });
  }, []);

  if (permission)
    return <VideoContainer channelName={channelName} appId={appId} />;
  else return null;
};
