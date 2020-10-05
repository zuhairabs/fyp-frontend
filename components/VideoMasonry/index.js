import React from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS, textStyles} from '../../styles/styles';
import VideoCard from '../Carousel/Card/VideoCard';

export default ({videos, title}) => (
  <>
    {videos && videos.length > 0 && (
      <Text
        style={{
          marginTop: 10,
          textTransform: 'uppercase',
          color: COLORS.SECONDARY,
          paddingHorizontal: 20,
          ...textStyles.paragraphMediumBold,
        }}>
        {title}
      </Text>
    )}
    <FlatList
      data={videos}
      renderItem={({item}) => <VideoCard video={item} />}
      numColumns={2}
      bounces={true}
      initialNumToRender={2}
      maxToRenderPerBatch={4}
      keyExtractor={(item) => item._id}
      style={{marginTop: 20, alignSelf: 'center'}}
    />
  </>
);
