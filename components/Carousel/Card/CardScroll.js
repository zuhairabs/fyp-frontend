import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {textStyles} from '../../../styles/styles';
import StoreCard from './StoreCard';
import VideoCard from './VideoCard';

const CardScroll = ({data, title, videos}) => {
  return (
    <>
      {data && data.length > 0 && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={data}
        renderItem={({item}) =>
          videos ? <VideoCard video={item} /> : <StoreCard store={item} />
        }
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
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
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 10,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    color: '#666',
    ...textStyles.paragraphMediumBold,
  },
});

export default CardScroll;
