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

const getFeaturedVideos = (videoUrl) =>
  new Promise((resolve, reject) => {
    fetch(`${URI}/user/${videoUrl}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/JSON',
      },
    }).then(
      (res) => {
        if (res.status === 200)
          res.json().then((data) => resolve(data.videos || data.video));
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
    let uri = `${props.item.uri}`;
    if (props.location) {
      const {lat, long} = props.location;
      const locationParams = `lat=${lat}&lng=${long}`;
      if (props.multiParam) uri = `${uri}&${locationParams}`;
      else uri = `${uri}?${locationParams}`;
    }
    const body = JSON.stringify({city: 'Mumbai'});
    Post(uri, body).then((data) => {
      setStores(data.response);
      if (props.videos) console.log(data.videos);
      setLoading(false);
    });
  }, [props.location]);

  return (
    <>
      <Text style={styles.mainSubHeading}>{props.item.title}</Text>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0062FF" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stores &&
              stores.map((store) => {
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
