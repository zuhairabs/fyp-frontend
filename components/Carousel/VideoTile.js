import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {navigationRef} from '../../Navigation/Navigation';
import BookButton from '../Buttons/BookButton';
import styles from './TileStyles';

const VideoTile = ({store}) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigationRef.current?.navigate('Store', {
            store: store._id,
            data: store,
            bookSlot: false,
          });
        }}
        style={styles.card}>
        <View style={styles.cardLeft}>
          <View>
            <Text style={styles.cardTitleSubtext}>{store.location_desc}</Text>
          </View>
          <View style={styles.cardTitle}>
            <Text style={styles.cardTitleText} numberOfLines={1}>
              {store.business.display_name}
            </Text>
            <Text
              style={styles.cardTitleTextBlack}
              allowFontScaling={true}
              numberOfLines={1}>
              {store.name}
            </Text>
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
        <View style={styles.cardRight}>
          <Image
            source={{
              uri: `data:image/gif;base64,${
                store.business.title_image || store.business.logo
              }`,
            }}
            style={styles.cardImage}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default VideoTile;
