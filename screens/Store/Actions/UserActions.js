import {ToastAndroid, Alert} from 'react-native';
import {Post} from '../../../api/http';

export const addFav = (userActions, state, store) =>
  new Promise((resolve, reject) => {
    makeRequest('add', state, store)
      .then(() => {
        userActions.addFav(store);
        ToastAndroid.show('Added to favourites', ToastAndroid.SHORT);
        resolve();
      })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });

export const removeFav = (userActions, state, store) =>
  new Promise((resolve, reject) => {
    showRemoveFavAlert()
      .then(() => {
        makeRequest('remove', state, store)
          .then(() => {
            userActions.removeFav(store);
            ToastAndroid.show('Removed from favourites', ToastAndroid.SHORT);
            resolve();
          })
          .catch(() => reject());
      })
      .catch(() => reject());
  });

const makeRequest = (action, state, store) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({
      storeData: {
        _id: store,
      },
      cred: {
        phone: state.user.phone,
      },
    });
    Post(`app/favourite/${action}/store`, body, state.token)
      .then((data) => resolve())
      .catch(() => reject());
  });

const showRemoveFavAlert = () =>
  new Promise((resolve, reject) => {
    Alert.alert('Do you want to remove the store from your favourites?', '', [
      {
        text: 'NO',
        onPress: () => {
          reject();
        },
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          resolve();
        },
        style: 'default',
      },
    ]);
  });
