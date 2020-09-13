import {PostBaseRoute} from '../../../api/http';
const allParticipantsUri = 'rtc-video/fetch/all';
const singleParticipantUri = 'rtc-video/fetch/single';

export const getChannelParticipantsInfo = (channelName) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({channelName});
    PostBaseRoute(allParticipantsUri, body)
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });

export const getSingleParticipantInfo = async (channelName, uid) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({
      channelName,
      uid,
    });
    PostBaseRoute(singleParticipantUri, body)
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });
