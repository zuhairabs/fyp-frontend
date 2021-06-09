import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {navigationRef} from '../../../Navigation/Navigation';
import {textStyles} from '../../../styles/styles';
import styles from './Styles';

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

const OrderCardSmall = (props) => {
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
              {new Date(props.order.date).getUTCDate()}
            </Text>
            <Text style={styles.date} numberOfLines={1}>
              {mlist[new Date(props.order.date).getUTCMonth()]}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `data:image/gif;base64,${props.order.product.image}`,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.header} numberOfLines={1}>
              {props.order.product.name}
            </Text>

            <View style={styles.time}>
              <Text style={styles.timeText}>{props.order.variant}</Text>
            </View>

            <Text
              style={{
                marginTop: 5,
                textTransform: 'capitalize',
                ...textStyles.paragraphSmallBold,
              }}>
              {props.order.amount}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {extended ? (
          <View style={styles.extension}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate('Product', {
                  event: props.order.product.event,
                  orderData: props.order,
                  buyNow: false,
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

export default OrderCardSmall;
