import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {navigationRef} from '../../Navigation/Navigation';
import {textStyles} from '../../styles/styles';
import RatingBadge from '../RatingBadge/RatingBadge';
import BookButton from '../Buttons/BookButton';
import styles from './CardStyles';

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

export default CardSmall;
