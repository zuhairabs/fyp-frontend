import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Share from 'react-native-share';
import {GlobalContext} from '../../../providers/GlobalContext';
import {Post} from '../../../api/http';
import {textStyles, COLORS} from '../../../styles/styles';

const mlist = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const BookingCard = (props) => {
  const {state} = useContext(GlobalContext);
  const [extended, setExtended] = useState(false);

  const shareBooking = async () => {
    const display_name = props.booking.store.business.display_name;
    const date = new Date(props.booking.start);
    const display_date =
      date.toDateString() + ', ' + date.toLocaleTimeString().slice(0, 5);
    const options = {
      message: `I am heading to shop at ${display_name} on ${display_date}, want to join me? Click here!`,
      title: 'Try out the ShopOut app',
      url: 'https://shopout.co.in',
    };
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  const cancelBooking = async () => {
    const body = JSON.stringify({
      cred: {
        phone: user.phone,
      },
      bookingData: {
        _id: bookId,
        store: props.booking.store._id,
        user: state.user._id,
        visitors: props.booking.visitors,
        end: props.booking.end,
        start: props.booking.start,
      },
    });
    Post('user/booking/cancel', body, state.token).then(() => {
      ToastAndroid.show('Booking deleted successfully', ToastAndroid.LONG);
      props.removeBooking(props.booking._id);
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.mainCard}
          onPress={() => {
            extended ? setExtended(false) : setExtended(true);
          }}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {new Date(props.booking.start).getUTCDate()}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {mlist[new Date(props.booking.start).getUTCMonth()]}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `data:image/gif;base64,${
                  props.booking.store.business.title_image ||
                  props.booking.store.business.logo
                }`,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.header} numberOfLines={1}>
              {props.booking.store.business.display_name}{' '}
              {props.booking.store.name}
            </Text>

            <View style={styles.time}>
              <Icon name="access-time" size={16} color={COLORS.SECONDARY} />
              <Text style={styles.timeText}>
                {new Date(props.booking.start)
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                  .replace(/(:\d{2}| [AP]M)$/, '')}{' '}
                -{' '}
                {new Date(props.booking.end)
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                  .replace(/(:\d{2}| [AP]M)$/, '')}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {extended ? (
          <View style={styles.extension}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('SingleBooking', {
                  booking: props.booking._id,
                });
              }}
              style={styles.extensionTab}>
              <Text style={styles.tabText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.extensionTab}
              onPress={() => {
                props.navigation.navigate('Store', {
                  store: props.booking.store,
                  bookSlot: true,
                  editSlot: true,
                  previousBooking: props.booking,
                });
              }}>
              <Text style={styles.tabText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to cancel this appointment?',
                  '',
                  [
                    {
                      text: "No, don't",
                      onPress: () => {},
                      style: 'default',
                    },
                    {
                      text: 'Yes, cancel',
                      onPress: () => {
                        cancelBooking();
                      },
                      style: 'destructive',
                    },
                  ],
                );
              }}
              style={styles.extensionTab}>
              <Text style={styles.tabText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.extensionTabLast}
              onPress={() => {
                shareBooking();
              }}>
              <Icon name="share" size={16} color={COLORS.SECONDARY} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - 40,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    elevation: 3,
    zIndex: 0,
  },
  mainCard: {
    flex: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  dateContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  date: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmallBold,
  },
  imageContainer: {
    flex: 2,
    marginLeft: 20,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  details: {
    flex: 5,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  header: {
    ...textStyles.paragraphLarge,
    color: COLORS.SECONDARY,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...textStyles.paragraphSmall,
    color: COLORS.SECONDARY,
    marginLeft: 10,
  },
  extension: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    width: '100%',
    paddingVertical: 10,
  },
  extensionTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRightWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  extensionTabLast: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  tabText: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
});

export default BookingCard;
