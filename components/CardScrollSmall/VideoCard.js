import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {navigationRef} from '../../Navigation/Navigation';
import {textStyles, COLORS} from '../../styles/styles';
import {styles} from './CardSmall';

const videoCamStyle = {
  position: 'absolute',
  right: '6%',
  top: '2%',
  elevation: 5,
};

const VideoCard = ({video}) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigationRef.current?.navigate('Video', {video});
        }}>
        <View style={styles.cardHeader}>
          <Image source={{uri: video.thumbnail}} style={styles.cardImage} />
        </View>
        <View style={styles.cardContent}>
          <Text style={textStyles.smallCardHeading} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.cardSubtitle}>
            <View style={styles.cardLocation}>
              <Text style={styles.cardSubtitleText} numberOfLines={1}>
                {video.business.display_name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={videoCamStyle}>
        <Icon name="videocam" size={24} color={COLORS.WHITE} />
      </View>
    </View>
  </View>
);

export default VideoCard;
