import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {navigationRef} from '../../Navigation';
import {textStyles, COLORS} from '../../styles/styles';
import RatingBadge from '../RatingBadge/RatingBadge';
import BookButton from '../Buttons/BookButton';
const DEVICE_WIDTH = Dimensions.get('window').width;

const CardSmall = ({store}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigationRef.current?.navigate('Store', {
              store: store._id,
              data: store,
            });
          }}>
          <View style={styles.cardHeader}>
            <Image
              source={{
                uri: `data:image/gif;base64,${
                  store.business.title_image || store.business.logo
                }`,
              }}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={textStyles.smallCardHeading}>
              {store.business.display_name}
            </Text>
            <Text style={textStyles.smallCardHeading}>{store.name}</Text>
            <View style={styles.cardSubtitle}>
              <View style={styles.cardLocation}>
                <Icon name="location-on" size={10} color="#666" />

                <Text style={styles.cardSubtitleText} numberOfLines={1}>
                  {store.location_desc}
                </Text>
              </View>
              {store.displacement && (
                <Text style={styles.cardSubtitleText}>
                  {Math.round(store.displacement * 10) / 10} km
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate('Store', {
                  store: store._id,
                  data: store,
                  bookSlot: true,
                });
              }}>
              <BookButton />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.ratingBadge}>
          <RatingBadge
            value={
              store.avg_rating || Math.floor(Math.random() * 4 * 10) / 10 + 1
            }
          />
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: Math.floor(DEVICE_WIDTH / 2.6),
    marginVertical: 10,
    marginRight: 20,
    marginLeft: 5,
  },
  card: {
    height: 272,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',

    elevation: 5,
    borderRadius: 15,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 134,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  cardSubtitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtitleText: {
    color: '#666',
    flexWrap: 'wrap',
    flexDirection: 'row',
    ...textStyles.paragraphExtraSmall,
  },
  cardHeader: {
    width: '100%',
    height: 138,
  },
  cardImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    // right: -Math.floor(DEVICE_WIDTH/2.6),
    right: '-10%',
    bottom: '-6%',
    elevation: 5,
  },
});

export default CardSmall;
