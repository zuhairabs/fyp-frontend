import {Post} from '../../../api/http';
const allParticipantsUri = 'user/video-rtc/users';
const singleParticipantUri = 'user/video-rtc/participant/fetch';

export const getChannelParticipantsInfo = (channelName) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({channelName});
    Post(allParticipantsUri, body)
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });

export const getSingleParticipantInfo = async (channelName, uid) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({
      channelName,
      uid,
    });
    Post(singleParticipantUri, body)
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });
