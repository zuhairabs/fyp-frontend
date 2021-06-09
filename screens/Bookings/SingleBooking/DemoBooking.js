/*eslint-disable*/
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import ShareIcon from '../../../components/UXComponents/svg/share-icon.svg'; //needed
import DetailsCard from './Container/DetailsCard';
import CallButton from '../../../components/UXComponents/svg/call-button.svg'; //needed
import { navigationRef } from '../../../Navigation/Navigation';
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const bookingStatusColor = {
  completed: '#1AB542',
  upcoming: '#0062FF',
  missed: '#FCC225',
  cancelled: '#E50A17',
};

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

export default (props) => {
  const formatTimeString = (date) => {
    return new Date(date)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/(:\d{2}| [AP]M)$/, '');
  };

  const getDetailsTime = () => {
    console.log('props.booking in demo ', props.booking);
    const start = formatTimeString(props.booking.startTime);
    return `${start}`;
  };

  const getDetailsDate = () => new Date(props.booking.startTime).toDateString();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <View style={styles.details}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `data:image/gif;base64,${props.booking.image}`,
              }}
              style={{
                width: '100%',
                height: '70%',
                borderRadius: 15,
              }}
            />
            <View style={styles.shareContainer}>
              <TouchableOpacity
                onPress={() => {
                  shareDemoBooking();
                }}>
                <ShareIcon height={16} width={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  shareDemoBooking();
                }}>
                <Text style={{ ...styles.paragraphExtraSmall, marginLeft: 8 }}>
                  Share Link
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{props.booking.demoName}</Text>
            <Text
              style={{
                marginTop: 5,
                color: bookingStatusColor[props.booking.status],
                textTransform: 'capitalize',
                ...styles.paragraphSmallBold,
              }}>
              {props.booking.status}
            </Text>
          </View>
        </View>
        <View style={styles.description}>
          <Text style={styles.paragraphExtraSmall}>
            {props.booking.description}
          </Text>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <DetailsCard
          title="Appointment Time"
          text={getDetailsTime()}
          icon="schedule"
        />
        <DetailsCard
          title="Appointment Date"
          text={getDetailsDate()}
          icon="date-range"
        />
      </View>
      <View style={styles.callButton}>
        <TouchableOpacity
          onPress={() => {
            navigationRef.current?.navigate('LiveStream', {
              event: props.booking._id,
              channelName: props.booking.channelName,
            });
          }}
        >
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            width: 340,
            borderRadius: 30,
            backgroundColor: '#0062FF',
            marginBottom: 5,
          }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Black',
                color: 'white',
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
              JOIN NOW
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shareContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraphSmallBold: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Roboto-Medium',
  },
  callButton: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    marginBottom: 0,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
  },
  cardContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraphExtraSmall: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Roboto-Medium',
  },
  title: {
    lineHeight: 25,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 5,
    maxWidth: '100%',
  },
  status: {
    color: '#95F1CE',
    lineHeight: 16,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    marginTop: 5,
    maxWidth: '100%',
  },
  screenContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
  },
  contentContainer: {
    borderWidth: 5,
    borderColor: 'red',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: DEVICE_HEIGHT,
    marginBottom: 100,
  },
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 100,
    height: 140,
    borderRadius: 6,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  details: {
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
    flexDirection: 'row',
  },
  titleContainer: {
    marginLeft: 15,
    flex: 1,
  },
  description: {
    width: '100%',
    marginTop: 12,
  },
});
