import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {textStyles} from '../../../styles/styles';
import StoreTile from './StoreTile';
import VideoTile from './VideoTile';

const TileScroll = ({data, title, videos}) => {
  const [current, setCurrent] = useState(0);

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrent(pageNum);
  };

  return (
    <>
      {data && data.length > 0 && <Text style={styles.title}>{title}</Text>}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index + 20}
            style={
              current === index ? styles.indicatorSelected : styles.indicator
            }
          />
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={({item}) =>
          videos ? <VideoTile video={item} /> : <StoreTile store={item} />
        }
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={true}
        initialNumToRender={2}
        maxToRenderPerBatch={4}
        pagingEnabled
        contentContainerStyle={styles.container}
        onMomentumScrollEnd={onScrollEnd}
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
    paddingHorizontal: 40,
    textTransform: 'uppercase',
    color: '#666',
    ...textStyles.paragraphMediumBold,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 52, //card border radius + card margin horizontal
    zIndex: 2,
    width: 55,
  },
  indicatorSelected: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#0062FF',
    borderRadius: 6,
    opacity: 1,
  },
  indicator: {
    paddingRight: 2,
    paddingLeft: 3,
    borderWidth: 1,
    borderColor: '#0062FF',
    opacity: 0.5,
    borderRadius: 6,
  },
});

export default TileScroll;
