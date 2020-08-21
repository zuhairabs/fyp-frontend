import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {navigationRef} from '../../Navigation/Navigation';

import BookButton from '../Buttons/BookButton';
import {textStyles, COLORS} from '../../styles/styles';
const DEVICE_WIDTH = Dimensions.get('window').width;

export const BigCardLoading = () => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback style={styles.card}>
        <View style={styles.cardLeft}>
          <ActivityIndicator />
        </View>
        <View style={styles.cardRight} />
      </TouchableWithoutFeedback>
    </View>
  );
};

const BigCard = (props) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigationRef.current?.navigate('Store', {
            store: props.store._id,
            data: props.store,
            bookSlot: false,
          });
        }}
        style={styles.card}>
        <View style={styles.cardLeft}>
          <View>
            <Text style={styles.cardTitleSubtext}>
              {props.store.location_desc}
            </Text>
          </View>
          <View style={styles.cardTitle}>
            <Text style={styles.cardTitleText} numberOfLines={1}>
              {props.store.business.display_name}
            </Text>
            <Text
              style={styles.cardTitleTextBlack}
              allowFontScaling={true}
              numberOfLines={1}>
              {props.store.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigationRef.current?.navigate('Store', {
                store: props.store._id,
                data: props.store,
                bookSlot: true,
              });
            }}>
            <BookButton />
          </TouchableOpacity>
        </View>
        <View style={styles.cardRight}>
          <Image
            source={{
              uri: `data:image/gif;base64,${
                props.store.business.title_image || props.store.business.logo
              }`,
            }}
            style={styles.cardImage}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,

    justifyContent: 'center',
    alignItems: 'center',

    height: 220,
    width: DEVICE_WIDTH,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    elevation: 8,
    borderRadius: 12,

    height: 200,
    width: DEVICE_WIDTH - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 10,
  },
  cardLeft: {
    paddingVertical: 24,
    paddingLeft: 16,
    paddingRight: 8,
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    justifyContent: 'space-around',
  },
  cardTitleText: {
    color: '#1162FB',
    ...textStyles.bigCardHeading,
  },
  cardTitleTextBlack: {
    color: '#000',
    ...textStyles.bigCardHeading,
  },
  cardTitleSubtext: {
    textTransform: 'uppercase',
    fontFamily: 'notoserif',
    fontSize: 10,
  },
  cardRight: {
    width: '100%',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: undefined,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default BigCard;
