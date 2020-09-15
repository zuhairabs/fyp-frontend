import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {fullSearchAPI} from '../../screens/Search/controllers';
import {COLORS} from '../../styles/styles';
import VideoCard from '../CardScrollSmall/VideoCard';

export default ({query}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query)
      fullSearchAPI(query, 'video')
        .then((videos) => {
          setVideos(videos);
          setLoading(false);
        })
        .catch((e) => {
          setVideos([]);
          setLoading(false);
        });
  }, [query]);

  if (loading) {
    return <ActivityIndicator color={COLORS.PRIMARY} />;
  } else {
    return (
      <View>
        {videos && videos.length > 0 ? (
          <View>
            <FlatList
              data={videos}
              renderItem={({item}) => <VideoCard video={item} />}
              numColumns={2}
              bounces={true}
              initialNumToRender={2}
              maxToRenderPerBatch={4}
              keyExtractor={(item) => item._id}
              style={{marginTop: 20}}
            />
          </View>
        ) : (
          <Text>No videos available</Text>
        )}
      </View>
    );
  }
};
