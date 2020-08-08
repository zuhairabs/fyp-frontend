import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import CardSmall from './CardSmall';
import {textStyles} from '../../styles/styles';

import {URI} from '../../api/constants';
import {GlobalContext} from '../../providers/GlobalContext';
import {Post} from '../../api/http';

const CardScrollSmall = (props) => {
  const {state} = useContext(GlobalContext);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [props.location]);

  return (
    <>
      <Text style={styles.mainSubHeading}>{props.item.title}</Text>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0062FF" />
        ) : (
          <ScrollView
            horizontal
            // showsHorizontalScrollIndicator={false}
          >
            {stores.map((store) => {
              return <CardSmall key={store._id} store={store} />;
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
    paddingLeft: 20,
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
