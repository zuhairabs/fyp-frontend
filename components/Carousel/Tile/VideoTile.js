import React from 'react';
import {Text, View, Image} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import styles from './TileStyles';

const VideoTile = ({video}) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => {}} style={styles.card}>
        <View style={styles.cardLeft}>
          <View>
            <Text style={styles.cardTitleSubtext}>{video.location_desc}</Text>
          </View>
          <View style={styles.cardTitle}>
            <Text style={styles.cardTitleText} numberOfLines={1}>
              {video.business.display_name}
            </Text>
            <Text
              style={styles.cardTitleTextBlack}
              allowFontScaling={true}
              numberOfLines={1}>
              {video.title}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Image
            source={{
              uri: video.thumbnail,
            }}
            style={styles.cardImage}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default VideoTile;
