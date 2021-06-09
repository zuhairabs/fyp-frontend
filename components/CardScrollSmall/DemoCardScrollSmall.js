import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Post } from '../../api/http';
import DemoDummyCard from '../Carousel/Card/DemoDummyCard';
import DemoCardScroll from '../Carousel/Card/DemoCardScroll';
import { GlobalContext } from '../../providers/GlobalContext';

const DemoCardScrollSmall = (props) => {
  const { state } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    let uri = 'app/home/demoBooking/all';
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
    });
    Post(uri, body, state.token).then((data) => {
      setResponse(data.demobookings);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <DemoDummyCard /> : <DemoCardScroll data={response} title={props.title} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default DemoCardScrollSmall;