import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import CardSmall from './CardSmall';
import VideoCard from './VideoCard';
import {textStyles} from '../../styles/styles';
import {URI} from '../../api/constants';
import {Post} from '../../api/http';

const getFeaturedVideos = () =>
  new Promise((resolve, reject) => {
    fetch(`${URI}/user/video/featured`, {
      method: 'GET',
      headers: {
        'content-type': 'application/JSON',
      },
    }).then(
      (res) => {
        if (res.status === 200) res.json().then((data) => resolve(data.video));
        else reject('Not found');
      },
      (e) => {
        reject(e);
      },
    );
  });

const CardScrollSmall = (props) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.videos) {
      getFeaturedVideos()
        .then((data) => {
          setStores(data);
          setLoading(false);
        })
        .catch((e) => console.log(e));
    } else {
      let uri = `user${props.item.uri}`;
      if (props.location) {
        const lat = props.location.lat;
        const long = props.location.long;
        if (props.multiParam)
          uri = `user${props.item.uri}&lat=${lat}&lng=${long}`;
        else uri = `user${props.item.uri}?lat=${lat}&lng=${long}`;
      }
      const body = JSON.stringify({city: 'Mumbai'});
      Post(uri, body).then((data) => {
        setStores(data.response);
        setLoading(false);
      });
    }
  }, [props.location]);

  return (
    <>
      <Text style={styles.mainSubHeading}>{props.item.title}</Text>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0062FF" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stores.map((store) => {
              return props.videos ? (
                <VideoCard key={store._id} video={store} />
              ) : (
                <CardSmall key={store._id} store={store} />
              );
            })}
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingLeft: 30,
    height: 320,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainSubHeading: {
    marginHorizontal: 35,
    marginTop: 10,
    textTransform: 'uppercase',
    color: '#666',
    ...textStyles.paragraphMediumBold,
  },
});

export default CardScrollSmall;
