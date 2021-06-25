import React, {useState, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {GlobalContext} from '../../../providers/GlobalContext';
import {Post} from '../../../api/http';

import StatusBarWhite from '../../../components/StatusBar';
import LoadingContainer from './Container/LoadingContainer';
import styles from './Styles';
import DemoBooking from './DemoBooking';

const archivedUri = 'demoBooking/fetch/single/archived';
const upcomingUri = 'demoBooking/fetch/single';

const SingleDemoBooking = (props) => {
  const {state} = useContext(GlobalContext);

  console.log("DATA FROM SDB ==> ", props.route.params.booking);

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
      console.log('booking data in singledemobooking is ', data);
      setBooking(data.demobooking);
      setLoading(false);
    });
  }, [_id, archived]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      {loading ? (
        <ScrollView style={styles.container}>
          <LoadingContainer />
        </ScrollView>
      ) : (
        <DemoBooking booking={booking} />
      )}
    </View>
  );
};

export default SingleDemoBooking;
