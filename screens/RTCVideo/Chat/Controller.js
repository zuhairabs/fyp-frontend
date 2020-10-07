import firestore from '@react-native-firebase/firestore';
import {navigationRef} from '../../../Navigation/Navigation';
import {chatBoxRef} from '../VideoContainer/VideoContainer';

export const navigateToExternalLink = (uri, title = 'External link') => {
  navigationRef.current?.navigate('FullScreenWebView', {
    title,
    uri,
  });
  chatBoxRef.current?.close();
};

export const init = (channel) => {
  firestore()
    .collection('THREADS')
    .add({name: channel})
    .then(() => {
      console.log(`Channel ${channel} created`);
    })
    .catch((error) => {
      console.error(`Couldn't connect to channel ${channel}`, {error});
    });
};
