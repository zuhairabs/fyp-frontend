import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {navigationRef} from '../../../Navigation/Navigation';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {textStyles, COLORS} from '../../../styles/styles';
import styles from './Styles';

const bookingStatusColor = {
  completed: '#1AB542',
  upcoming: '#0062FF',
  missed: '#FCC225',
  cancelled: '#E50A17',
};

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

const BookingCardSmall = (props) => {
  const [extended, setExtended] = useState(false);

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
              {props.booking.type === 'virtual' ? (
                <Icon name="videocam" size={16} color={COLORS.SECONDARY} />
              ) : (
                <Icon name="access-time" size={16} color={COLORS.SECONDARY} />
              )}
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

            <Text
              style={{
                marginTop: 5,
                color: bookingStatusColor[props.booking.status],
                textTransform: 'capitalize',
                ...textStyles.paragraphSmallBold,
              }}>
              {props.booking.status}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {extended ? (
          <View style={styles.extension}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate('SingleBooking', {
                  archived: true,
                  booking: props.booking._id,
                });
              }}
              style={styles.extensionTabLast}>
              <Text style={styles.tabText}>View</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BookingCardSmall;
