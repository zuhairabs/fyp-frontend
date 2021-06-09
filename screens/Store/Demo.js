import React from 'react';
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { COLORS, textStyles } from '../../styles/styles';
import { navigationRef } from '../../Navigation/Navigation';
import RegisterButton from './res/register-button.svg';
import CallButton from './res/call-button.svg';
import ClockIcon from './res/clock-icon.svg';
import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './../../providers/GlobalContext';
import { Post } from './../../api/http';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT =
  DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);

export default (props) => {
  const { state } = useContext(GlobalContext);
  const demo = props.route.params.demo;
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('demo from props', demo);
    let uri = 'app/home/demoBooking/single';
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      bookingData: { _id: demo._id },
      user: { _id: state.user._id },
    });
    Post(uri, body, state.token).then((data) => {
      console.log('got the register data', data);
      setResponse(data.demoInformation);
      setLoading(false);
    });
  }, []);

  const timeToText = () => {
    return new Date(demo.startTime).toDateString();
  };

  const registeredFunction = () => {
    ToastAndroid.showWithGravity(
      'You have already registered for the event',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const slotsFullFunction = () => {
    ToastAndroid.showWithGravity(
      'Oops! the event is fully booked, Please try for alternate dates. We hope to see you there.',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const callFunction = () => {
    navigationRef.current?.navigate('LiveStream', {
      event: demo._id,
      channelName: demo.channelName,
    });
  };

  const eventLiveToast = () => {
    ToastAndroid.showWithGravity(
      'Event is Live now, please join',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const registerFunction = () => {
    let uri = 'demoBooking/actions/register';
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
      bookingData: { _id: demo._id },
      user: { _id: state.user._id },
    });
    Post(uri, body, state.token).then((data) => {
      console.log('Regsitered a user');
      navigationRef.current?.reset({
        index: 1,
        routes: [
          {
            name: 'Home',
          },
          {
            name: 'Congratulations',
            params: {
              text: 'You have successfully registered for the event',
              booking: demo._id,
              demoBooking: true,
            },
            screenOptions: {
              headerShown: false,
            },
          },
        ],
      });
    });
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        animated={true}
        translucent
      />
      <View
        style={{
          alignSelf: 'stretch',
          height: Dimensions.get('window').height / 2,
        }}>
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
              style={{
                flex: 1,
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              locations={[0, 0.5]}
            />
          }>
          <Image
            source={{
              uri: `data:image/gif;base64,${demo.image}`,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </MaskedView>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{demo.demoName}</Text>
        <View
          style={{
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ClockIcon height={16} width={16} />
          <Text
            style={{
              ...textStyles.paragraphSmall,
              color: COLORS.SECONDARY,
              marginLeft: 10,
            }}>
            {timeToText()}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.descriptionBox}>
            <Text style={textStyles.paragraphExtraSmall}>
              {demo.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonArea}>
        {loading ? (
          <ActivityIndicator
            animating={true}
            size="large"
            color={COLORS.PRIMARY}
            style={{ paddingBottom: 8 }}
          />
        ) : response.capacityFull ? (
          <TouchableWithoutFeedback
            onPress={slotsFullFunction}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 340,
              borderRadius: 30,
              backgroundColor: '#D9D9D9',
              marginBottom: 5,
            }}>
            {slotsFullFunction()}
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Black',
                color: COLORS.WHITE,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
              CAPACITY FULL
            </Text>
          </TouchableWithoutFeedback>
        ) : response.liveNow ? (
          <TouchableWithoutFeedback
            onPress={() => callFunction()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 340,
              borderRadius: 30,
              backgroundColor: '#0062FF',
              marginBottom: 5,
            }}>
            {eventLiveToast()}
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Black',
                color: COLORS.WHITE,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
              JOIN NOW
            </Text>
          </TouchableWithoutFeedback>
        ) : response.userRegistered ? (
          <TouchableWithoutFeedback
            onPress={registeredFunction}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 340,
              borderRadius: 30,
              backgroundColor: '#D9D9D9',
              marginBottom: 5,
            }}>
            {registeredFunction()}
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Roboto-Black',
                color: COLORS.WHITE,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}>
              REGISTERED
            </Text>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableOpacity onPress={registerFunction}>
            <RegisterButton height={65} width={340} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    marginHorizontal: 30,
    height: Dimensions.get('window').height,
    marginBottom:
      (NAVIGATION_HEIGHT - 30 > 0 ? NAVIGATION_HEIGHT - 30 : 30) + 90,
  },
  title: {
    ...textStyles.paragraphLargeBold,
    marginTop: 10,
    maxWidth: '100%',
  },
  descriptionBox: {
    marginBottom: 15,
  },
  buttonArea: {
    // borderWidth: 5,
    // borderColor: 'red',
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    bottom: NAVIGATION_HEIGHT,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: NAVIGATION_HEIGHT - 30 > 0 ? NAVIGATION_HEIGHT - 30 : 30,
  },
});