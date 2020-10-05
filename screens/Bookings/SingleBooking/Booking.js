import React, {useState} from 'react';
import {View} from 'react-native';

import StoreCard from '../../../components/Cards/StoreCard/StoreCard';
import styles from './Styles';
import DetailsCard from './Container/DetailsCard';
import QrContainer from './Container/QrContainer';
import ButtonContainer from './Container/ButtonContainer';
import Rating from './Rating/Rating';

export default ({booking}) => {
  // 0 is booking page, 1 is review page
  const [screen, setScreen] = useState(0);

  const formatTimeString = (date) => {
    return new Date(date)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/(:\d{2}| [AP]M)$/, '');
  };

  const getDetailsTime = () => {
    const start = formatTimeString(booking.start);
    const end = formatTimeString(booking.end);
    return `${start} - ${end}`;
  };

  const getDetailsDate = () => new Date(booking.start).toDateString();

  return (
    <View style={styles.contentContainer}>
      <StoreCard store={booking.store} noBookButton status={booking.status} />
      <View style={styles.bookingData}>
        <View style={styles.cardContainer}>
          <DetailsCard
            title="Appointment Time"
            text={getDetailsTime()}
            icon={booking.type === 'virtual' ? 'videocam' : 'directions-walk'}
          />
          <DetailsCard
            title="Appointment Date"
            text={getDetailsDate()}
            icon="date-range"
          />
        </View>
        <View>
          {screen === 0 ? (
            <>
              <QrContainer booking={booking} />
              {!booking.review && (
                <ButtonContainer booking={booking} setScreen={setScreen} />
              )}
            </>
          ) : (
            <Rating booking={booking} />
          )}
        </View>
      </View>
    </View>
  );
};
