/* eslint-disable */
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { navigationRef } from '../../../Navigation/Navigation';
import LiveChat from '../Chat/LiveChat';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import BuyButton from '../../../components/UXComponents/svg/Buy-Button.svg';
import Share from 'react-native-share';

const shareDemoBooking = async () => {
  const options = {
    message:
      'Hey! I am Livestream shopping at Shopout! Join me here and lets have fun.',
    title: 'Try out the ShopOut app',
    url: 'https://play.google.com/store/apps/details?id=com.shopout.user',
  };
  Share.open(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};

export default ({ product, channelName, event, overlayFunctions }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Image
            source={require('../../../components/UXComponents/svg/live-icon.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: '75%',
              height: '100%',
              marginLeft: -22,
              marginTop: 3,
            }}
          />
          <View style={{ marginLeft: -10, marginRight: 12 }}>
            <Icon name="share" size={25} color="#FFF" onPress={() => shareDemoBooking()} />
          </View>
          <Icon name="info" size={25} color="#FFF" />
        </View>
        <View style={styles.topRight}>
          <TouchableOpacity
            onPress={() => {
              overlayFunctions.backAction();
            }}>
            <Icon name="close" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
          <LiveChat channel={channelName} />
        </View>
        <View style={styles.bottomRight}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'absolute',
              height: 70,
              width: 136,
              borderRadius: 35,
              backgroundColor: '#D7D6D0',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <View
              style={{
                position: 'absolute',
                marginTop: 5,
                height: 40,
                width: 115,
                borderRadius: 35,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text>{'\u20B9'}</Text>
              <Text
                style={{
                  marginLeft: 2,
                }}>
                {product.discounted}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 35,
                flexDirection: 'row',
              }}>
              <Text>{'\u20B9'}</Text>
              <Text
                style={{
                  marginLeft: 2,
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}>
                {product.price}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 70 }}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate('Product', { buyNow: true, event: event, channelName: channelName });
              }}>
              <BuyButton height={70} width={105} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    height: '97%',
    margin: 15,
    marginLeft: 5,
    width: '97%',
  },
  top: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'space-between',
    borderColor: 'purple',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginTop: '5%'
  },
  bottom: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: 280,
    alignItems: 'flex-end',
    bottom: 0,
  },
  topLeft: {
    position: 'absolute',
    flexDirection: 'row',
    width: 150,
    height: 30,
  },
  topRight: {
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    width: 30,
    height: 30,
  },
  bottomLeft: {
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 280,
    width: '60%',
    zIndex: 1,
  },
  bottomRight: {
    position: 'absolute',
    flexDirection: 'column',
    right: 0,
    width: '35%',
    height: 130,
    alignItems: 'center',
  },
});
