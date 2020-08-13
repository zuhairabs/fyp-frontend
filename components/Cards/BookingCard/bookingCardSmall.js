import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {textStyles, COLORS} from '../../../styles/styles';

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
            <Text style={styles.date}>
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
              <Icon name="access-time" size={16} color="#666" />
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
                props.navigation.navigate('SingleBooking', {
                  archived: true,
                  booking: props.booking._id,
                });
              }}
              style={styles.extensionTab}>
              <Text style={styles.tabText}>View</Text>
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
    ...textStyles.paragraphMedium,
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
  },
  tabText: {
    color: COLORS.SECONDARY,
    ...textStyles.paragraphSmall,
  },
});

export default BookingCardSmall;
