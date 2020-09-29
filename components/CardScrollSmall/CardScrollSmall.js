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
import {Post} from '../../api/http';

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
