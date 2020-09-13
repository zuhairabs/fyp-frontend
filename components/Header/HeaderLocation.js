import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {BASE_URI} from '../../api/constants';

import {COLORS, textStyles} from '../../styles/styles';

const Location = (params) => {
  const [location, setLocation] = useState('');
  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      const long = params.location.long,
        lat = params.location.lat;
      fetch(`${BASE_URI}/external/geocoding/reverse?lat=${lat}&long=${long}`, {
        method: 'GET',
        port: null,
        async: true,
        crossDomain: true,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {},
      }).then((res) => {
        if (res.status === 200)
          res.json().then((data) => {
            resolve(data);
          });
        else reject(res.statusText);
      });
    });
  };

  useEffect(() => {
    getLocation()
      .then((data) => {
        setLocation(`${data.place.area}, ${data.place.city}`);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [params.location]);

  return (
    <View style={Styles.location}>
      <Icon name="location-on" size={16} color={COLORS.SECONDARY} />
      {location.length > 0 ? (
        <Text style={Styles.text}>{location}</Text>
      ) : (
        <Text style={Styles.text}>Getting your location...</Text>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 25,
    marginTop: 2,
  },
  text: {
    paddingLeft: 10,
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
});

export default Location;
