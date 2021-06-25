import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { navigationRef } from '../../../Navigation/Navigation';
import { textStyles, COLORS } from '../../../styles/styles';
import BookButton from './../../Buttons/BookButton';
const DEVICE_WIDTH = Dimensions.get('window').width;

const videoCamStyle = {
  position: 'absolute',
  left: '5%',
  bottom: '5%',
  elevation: 5,
};

const VideoCard = ({ demo }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigationRef.current?.navigate('Demo', { demo });
        }}>
        <Image
          source={{
            uri: `data:image/gif;base64,${demo.image}`,
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 15,
          }}
        />
      </TouchableWithoutFeedback>
      <View style={videoCamStyle}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigationRef.current?.navigate('Demo', { demo });
          }}>
          <BookButton transparentBack={true} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: Math.floor(DEVICE_WIDTH / 2),
    marginTop: 4,
    borderRadius: 16,
    marginHorizontal: 15,
  },
  card: {
    height: 136,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',
    elevation: 6,
    borderRadius: 16,
  },
});

export default VideoCard;