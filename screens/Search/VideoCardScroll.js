import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import VideoCard from '../../components/CardScrollSmall/VideoCard';
import {textStyles} from '../../styles/styles';

const VideoCardScroll = ({videos, title}) => {
  return (
    <>
      {videos && videos.length > 0 && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={videos}
        renderItem={({item}) => <VideoCard video={item} />}
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        bounces={true}
        initialNumToRender={2}
        maxToRenderPerBatch={4}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 10,
    textTransform: 'uppercase',
    color: '#666',
    ...textStyles.paragraphMediumBold,
  },
});

export default VideoCardScroll;
