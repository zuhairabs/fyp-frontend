import {Post} from '../../../api/http';

export const saveStoreHistory = (store, phone) => {
  const body = JSON.stringify({
    storeData: store,
    cred: {
      phone: phone,
    },
  });
  Post('user/store/history/add', body);
};

export const getStoreVideos = async (businessId) => {
  const body = JSON.stringify({_id: businessId});
  const data = await Post('app/home/video/business', body);
  return data.response || [];
};

const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const constructActiveHoursText = (working_days, active_hours) => {
  const start = active_hours[0].start;
  const end = active_hours[0].end;
  const time = `${start} to ${end}`;
  const numberOfDays = working_days.length;
  if (working_days && numberOfDays > 0) {
    if (numberOfDays === 7) return `Open all days ${time}`;
    else if (numberOfDays === 6) {
      let offDay = '';
      for (let i = 0; i < 7; ++i)
        if (working_days.indexOf(i) === -1) {
          offDay = dayList[i];
          break;
        }
      return `Daily ${time}, ${offDay} closed`;
    } else {
      let string = '';
      for (let i = 0; i < 7; ++i)
        if (working_days.indexOf(i) > -1) string = string + dayList[i] + ', ';
      return `${string} ${time}`;
    }
  } else return `Open all days ${time}`;
};

export const getStoreData = () => {};
