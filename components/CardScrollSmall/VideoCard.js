import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {navigationRef} from '../../Navigation';
import {textStyles, COLORS} from '../../styles/styles';
import {styles} from './CardSmall';

const YT_API = {
  KEY: 'AIzaSyBFYI1ucm88RfrhyvT6a1DnTqiuSdtSwSM',
  URI: {
    SNIPPET: 'https://www.googleapis.com/youtube/v3/videos?part=snippet',
  },
};

const videoCamStyle = {
  position: 'absolute',
  right: '6%',
  top: '2%',
  elevation: 5,
};

const VideoCard = ({video}) => {
  const [snippet, setSnippet] = useState({});
  const getSnippet = () => {
    fetch(`${YT_API.URI.SNIPPET}&id=${video.source}&key=${YT_API.KEY}`, {
      method: 'GET',
      port: null,
      async: true,
      crossDomain: true,
      headers: {
        'content-type': 'application/JSON',
      },
    })
      .then((res) => {
        if (res.status === 200)
          res.json().then((data) => {
            setSnippet(data.items[0].snippet);
          });
        else console.log(res.status);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getSnippet();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigationRef.current?.navigate('Video', {
              loadedSnippet: snippet,
              loadedVideo: video,
            });
          }}>
          <View style={styles.cardHeader}>
            <Image
              source={{
                uri: snippet.thumbnails ? snippet.thumbnails.high.url : null,
              }}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={textStyles.smallCardHeading} numberOfLines={2}>
              {snippet && snippet.title}
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
};

export default VideoCard;
