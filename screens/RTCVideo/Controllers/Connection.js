import {PostBaseRoute} from '../../../api/http';
const registerRoute = 'rtc-video/register';

export const appId = 'de22f355862e48539cb856e69aa4d557';
export const generateRandomUid = () => {
  return Math.floor(Math.random() * 100);
};

export const registerNewParticipant = (ref_id, channelName, uid) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({
      type: 'user',
      ref_id,
      channelName,
      uid,
    });
    PostBaseRoute(registerRoute, body)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
