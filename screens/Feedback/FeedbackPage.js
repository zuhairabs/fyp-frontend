import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, BackHandler, ToastAndroid } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';

import styles from './Styles';
const WINDOW_WIDTH = Dimensions.get('window').width;

import Yes from './svg/Yes-Inverted';
import No from './svg/No-Button';
import Submit from './svg/Submit-Button.svg'

const formatTime = (date) => {
  return new Date(date)
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/(:\d{2}| [AP]M)$/, '');
};

const radioData = [{ label: true }, { label: false }];

export default (props) => {
  const productDetails = props.productDetails;
  const params = props.feedbackParams;
  const [feedback, setFeedback] = useState([true, true, true])

  const call = (input, index) => {
    const arr = [...feedback];
    arr[index] = input;
    setFeedback(arr);
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      ToastAndroid.showWithGravity("Feedback is mandatory. It won't take much time.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
      return true;
    })

    return () => {
      BackHandler.addEventListener("hardwareBackPress", () => {
        ToastAndroid.showWithGravity("Feedback is mandatory. It won't take much time.", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        return true;
      })
    }
  }, [props])

  return (
    <View style={styles.innerContainer}>
      <View style={styles.event}>
        <View style={styles.product}>
          <Image source={{ uri: `data:image/gif;base64,${productDetails.image}` }} style={styles.image} />
          <View style={styles.description}>
            <Text style={{ fontWeight: '700' }}>{productDetails.demoName}</Text>
            <Text style={{ fontSize: 12, color: '#757575' }}>{productDetails.description}</Text>
          </View>
        </View>
        <View style={styles.time}>
          <View style={styles.starttime}>
            <Text >{'Start Time'}</Text>
            <Text>{formatTime(productDetails.startTime)}</Text>
          </View>
          <View style={styles.endtime}>
            <Text >{'End Time'}</Text>
            <Text>{formatTime(props.leaveTime)}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: '5%', marginBottom: '-5%' }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: Math.floor(WINDOW_WIDTH / 3),
        }}>
          <Yes height={28} width={84} style={{ marginLeft: '-10%' }} />
          <No height={28} width={84} style={{ marginLeft: '-10%' }} />
        </View>
      </View>

      <View style={styles.feedback}>
        {
          params.map((item, index) => {
            return (
              <View key={item} style={styles.params} >
                <Text style={styles.paramText}>{item}</Text>
                <View style={styles.options}>
                  <RadioButtonRN
                    data={radioData}
                    box={false}
                    circleSize={10}
                    activeColor='#0063ff'
                    deactiveColor='#90A4AE'
                    style={{ flexDirection: 'row', alignItems: 'center', width: Math.floor(WINDOW_WIDTH / 5.4) }}
                    selectedBtn={(e) => { console.log(index, e.label); call(e.label, index) }}
                  />
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