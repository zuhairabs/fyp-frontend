import React from 'react';
import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import styles from './Styles';
import {RNCamera} from 'react-native-camera';

const userImage = require('../../assets/images/user.png');
const videoImage = require('../../assets/images/video.png');
const phoneCallImage = require('../../assets/images/phone-call.png');

export default function Ringer() {
  return (
    <View style={styles.screenContainer}>
      <RNCamera style={styles.camaraComponent} type="front" />
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View style={{alignItems: 'center', flex: 1}}>
          <StatusBar
            barStyle="default"
            backgroundColor="transparent"
            animated={true}
            translucent
          />
          <Image
            source={userImage}
            style={styles.userImage}
            resizeMode="cover"
          />
          <Text style={styles.userName}>Neel Patel</Text>
          <Text style={styles.incomingCallText}>
            Incoming ShopOut Video Call
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            marginBottom: 80,
            flexDirection: 'row',
            paddingHorizontal: 50,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.callDropButton}
            activeOpacity={0.7}
            onPress={() => console.log('Drop')}>
            <Image
              source={phoneCallImage}
              style={styles.callImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callAnswerButton}
            activeOpacity={0.7}
            onPress={() => console.log('Answer')}>
            <Image
              source={videoImage}
              style={styles.callImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
