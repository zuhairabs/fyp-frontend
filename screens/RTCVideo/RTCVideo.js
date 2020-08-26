import React, {useState, useEffect} from 'react';
import VideoContainer from './VideoContainer/VideoContainer';
import requestCameraAndAudioPermission from './VideoContainer/Permissions';
const appId = 'de22f355862e48539cb856e69aa4d557';
export default () => {
  const [permission, setPermissionStatus] = useState(false);
  const [channelName] = useState('test');

  useEffect(() => {
    requestCameraAndAudioPermission().then((granted) => {
      if (granted) setPermissionStatus(true);
      else console.log('Permissions not granted');
    });
  }, []);

  return permission && channelName ? (
    <VideoContainer channelName={channelName} appId={appId} />
  ) : null;
};
