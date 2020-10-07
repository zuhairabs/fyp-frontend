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

export const init = async (channel) => {
  await firestore()
    .collection('THREADS')
    .doc(channel)
    .get()
    .then((doc) => {
      if (doc.exists) console.log('Channel already exists in firestore');
      else initializeThread();
    })
    .catch((err) => console.log(err));
};

const initializeThread = async (channel) => {
  await firestore()
    .collection('THREADS')
    .doc(channel)
    .set(
      {
        name: channel,
      },
      {
        merge: true,
      },
    )
    .then(() => console.log('Channel added to thread', {channel}))
    .catch((error) =>
      console.log('Channel could not be added to thread', {channel, error}),
    );
};
