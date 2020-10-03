import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Post} from '../../api/http';
import VideoCardScroll from '../Carousel/VideoCardScroll';
import StoreCardScroll from '../Carousel/StoreCardScroll';

const CardScrollSmall = (props) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {lat, long} = props.location || {lat: null, long: null};
    const params = `?name=${props.category}&lat=${lat}&lng=${long}`;
    let uri = `${props.item.uri}${params}`;
    const body = JSON.stringify({city: 'Mumbai'});
    Post(uri, body).then((data) => {
      setStores(data.response);
      setLoading(false);
    });
  }, [props.location]);

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0062FF" />
      </View>
    );
  else
    return (
      <View style={styles.container}>
        {props.videos ? (
          <VideoCardScroll videos={stores} title={props.item.title} />
        ) : (
          <StoreCardScroll stores={stores} title={props.item.title} />
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default CardScrollSmall;
