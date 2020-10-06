import React, {useState, useEffect} from 'react';
import {View, Text, ToastAndroid} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from '../Styles';
import {COLORS, textStyles, buttons} from '../../../../styles/styles';
import {navigationRef} from '../../../../Navigation/Navigation';
import {Post} from '../../../../api/http';

import {Button} from '../Container/ButtonContainer';
import RatingParameter from './RatingParameter';

const Rating = ({booking}) => {
  const [parameters, setParameters] = useState([]);

  const formatParams = () => {
    let temp = [];
    if (booking.store.parameters)
      booking.store.parameters.forEach((param) => {
        temp.push({
          title: param.title,
          score: 0,
        });
      });
    return temp;
  };

  const changeRating = (index, score) => {
    setParameters((prev) => {
      prev[index].score = score;
      return prev;
    });
  };

  const submitReview = () => {
    const body = JSON.stringify({
      reviewData: {
        user: booking.user,
        store: booking.store,
        booking: booking._id,
        params: parameters,
      },
    });
    Post('app/review/submit', body).then(() => {
      ToastAndroid.show('Thank You!', ToastAndroid.SHORT);
      navigationRef.current?.navigate('Home');
    });
  };

  useEffect(() => {
    setParameters(formatParams());
  }, []);

  return (
    <View>
      <Text
        style={{
          marginTop: 50,
          color: COLORS.SECONDARY,
          ...textStyles.paragraphLarge,
        }}>
        Booking number: {booking.bookingId}
      </Text>
      <View style={styles.qrContainer}>
        {parameters.map((param, index) => {
          return (
            <RatingParameter
              changeRating={changeRating}
              name={param.title}
              index={index}
              key={index}
            />
          );
        })}
      </View>
      <View style={styles.buttonArea}>
        <Button text="Submit" buttonFunction={submitReview} />
      </View>
    </View>
  );
};

export default Rating;
