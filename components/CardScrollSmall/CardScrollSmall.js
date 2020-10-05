import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Post} from '../../api/http';
import DummyCard from '../Carousel/Card/DummyCard';
import CardScroll from '../Carousel/Card/CardScroll';

const CardScrollSmall = (props) => {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {lat, long} = props.location || {lat: null, long: null};
    const params = `?name=${props.category}&lat=${lat}&lng=${long}`;
    let uri = `${props.item.uri}${params}`;
    const body = JSON.stringify({city: 'Mumbai'});
    Post(uri, body).then((data) => {
      setResponse(data.response);
      setLoading(false);
    });
  }, [props.location]);

  return (
    <View style={styles.container}>
      {loading ? (
        <DummyCard />
      ) : (
        <CardScroll
          videos={props.videos}
          data={response}
          title={props.item.title}
        />
      )}
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

export default CardScrollSmall;
