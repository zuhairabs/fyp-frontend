import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

import styles from './Styles';
const WINDOW_WIDTH = Dimensions.get('window').width;

import Yes from './svg/Yes-Button';
import No from './svg/No-Button';
import Submit from './svg/Submit-Button'

const formatTime = (dateString) =>
  new Date(dateString.getTime() + 5.5 * 60 * 60 * 1000).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      timezone: 'Asia/Kolkata',
    }
  );

const timeNow = new Date();

export default (props) => {
  const productDetails = props.productDetails;
  const params = props.feedbackParams;
  const [feedback, setFeedback] = useState([])

  const call = (input, index) => {
    const arr = [...feedback];
    arr[index] = input;
    setFeedback(arr);
  }

  return (
    <View style={styles.innerContainer}>
      <View style={styles.event}>
        <View style={styles.product}>
          <Image source={{ uri: `data:image/gif;base64,${productDetails.image}` }} />
          <View style={styles.description}>
            <Text style={{ fontWeight: '700' }}>{productDetails.name}</Text>
            <Text style={{ fontSize: 14 }}>{productDetails.desc}</Text>
          </View>
        </View>
        <View style={styles.time}>
          <View style={styles.starttime}>
            <Text >{'Start Time'}</Text>
            <Text>{'12:30 PM'}</Text>
          </View>
          <View style={styles.endtime}>
            <Text >{'End Time'}</Text>
            <Text>{formatTime(timeNow)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.feedback}>
        {
          params.map((item, index) => {
            return (
              <View key={item} style={styles.params} >
                <Text style={styles.paramText}>{item}</Text>
                <View style={styles.options}>
                  <TouchableOpacity onPress={() => call(true, index)} >
                    <Yes height={28} width={96} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => call(false, index)} >
                    <No height={28} width={96} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        }
      </View>

      <TouchableOpacity onPress={() => props.callback(feedback)} >
        <Submit height={56} width={256} style={{ alignSelf: 'center', marginTop: Math.floor(WINDOW_WIDTH / 10) }} />
      </TouchableOpacity>
    </View>
  )
}