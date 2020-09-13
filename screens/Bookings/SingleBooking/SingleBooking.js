import React, {useState, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {GlobalContext} from '../../../providers/GlobalContext';
import {Post} from '../../../api/http';

import StatusBarWhite from '../../../components/StatusBar';
import LoadingContainer from './Container/LoadingContainer';
import styles from './Styles';
import Booking from './Booking';

const archivedUri = 'booking/fetch/single/archived';
const upcomingUri = 'booking/fetch/single';

const SingleBooking = (props) => {
  const {state} = useContext(GlobalContext);

  const _id = props.route.params.booking;
  const archived = props.route.params.archived;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({});

  useEffect(() => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      bookingData: {
        _id,
      },
    });
    const uri = archived ? archivedUri : upcomingUri;
    Post(uri, body, state.token).then((data) => {
      setBooking(data.booking);
      setLoading(false);
    });
  }, [_id, archived]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <ScrollView style={styles.container}>
        {loading ? <LoadingContainer /> : <Booking booking={booking} />}
      </ScrollView>
    </View>
  );
};

export default SingleBooking;
