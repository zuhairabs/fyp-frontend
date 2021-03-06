import { URI, BASE_URI, ERROR_MESSAGE } from './constants';
import { ToastAndroid } from 'react-native';
const showErrorToast = (msg) => ToastAndroid.show(msg, ToastAndroid.LONG);
export const Post = (route, body = {}, token = '') =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: body,
    };
    fetch(`${URI}/${route}`, options).then(
      (res) => {
        console.log(`${URI}/${route}`)
        if (res.status === 200 || res.status === 201) res.json().then((data) => resolve(data));
        else {
          reject(ERROR_MESSAGE[res.status]);
          showErrorToast(ERROR_MESSAGE[res.status]);
        }
      },
      (e) => {
        showErrorToast(e);
        reject(e);
      },
    );
  });

export const PostBaseRoute = (route, body = {}, token = '') =>
  new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: body,
    };
    fetch(`${BASE_URI}/${route}`, options).then(
      (res) => {
        if (res.status === 200) res.json().then((data) => resolve(data));
        else {
          reject(ERROR_MESSAGE[res.status]);
          showErrorToast(ERROR_MESSAGE[res.status]);
        }
      },
      (e) => {
        showErrorToast(e);
        reject(e);
      },
    );
  });
