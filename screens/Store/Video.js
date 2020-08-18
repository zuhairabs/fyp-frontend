import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Text,
} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import YouTube from 'react-native-youtube';

import {COLORS, textStyles} from '../../styles/styles';
import {URI} from '../../api/constants';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const YT_API = {
  KEY: 'AIzaSyBFYI1ucm88RfrhyvT6a1DnTqiuSdtSwSM',
  URI: {
    SNIPPET: 'https://www.googleapis.com/youtube/v3/videos?part=snippet',
  },
};

const getRandomVideo = () =>
  new Promise((resolve, reject) => {
    fetch(`${URI}/user/video/random`, {
      method: 'GET',
      headers: {
        'content-type': 'application/JSON',
      },
    }).then(
      (res) => {
        if (res.status === 200) res.json().then((data) => resolve(data.video));
        else reject('Not found');
      },
      (e) => {
        reject(e);
      },
    );
  });

export default (props) => {
  const {loadedSnippet, loadedVideo} = props.route.params;
  const calculatePlayerHeight = () => (WINDOW_WIDTH * 9) / 16;
  const [snippet, setSnippet] = useState(loadedSnippet);
  const [video, setVideo] = useState(loadedVideo);
  const [likes, setLikes] = useState(loadedVideo ? loadedVideo.likes : null);
  const [dislikes, setDislikes] = useState(
    loadedVideo ? loadedVideo.dislikes : null,
  );
  const [liked, setLiked] = useState('unliked');

  const getVideoDetails = (id) => {
    fetch(`${YT_API.URI.SNIPPET}&id=${id}&key=${YT_API.KEY}`, {
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
          res.json().then((data) => setSnippet(data.items[0].snippet));
        else console.log(res.status);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const toggleLike = (status) => {
    let temp = liked;
    if (status === temp) {
      setLiked('unliked');
      if (status === 'liked') setLikes((prev) => prev - 1);
      else if (status === 'disliked') setDislikes((prev) => prev - 1);
    } else if (status === 'liked') {
      setLiked('liked');
      setLikes((prev) => prev + 1);
      if (temp === 'disliked') setDislikes((prev) => prev - 1);
    } else if (status === 'disliked') {
      setLiked('disliked');
      setDislikes((prev) => prev + 1);
      if (temp === 'liked') setLikes((prev) => prev - 1);
    }
  };

  const onPressCart = () => {
    let brand = video.brand;
    let tag = video.tag;
    if (brand && brand.name) {
      props.navigation.navigate('SearchFull', {
        initial: {
          query: brand.name,
          id: brand._id,
          model: 'brand',
        },
        autoFocus: false,
      });
    } else if (tag && tag.name) {
      props.navigation.navigate('SearchFull', {
        initial: {
          query: tag.name,
          id: tag._id,
          model: 'tag',
        },
        autoFocus: false,
      });
    }
  };

  useEffect(() => {
    if (video) {
      if (!snippet) getVideoDetails(video.source);
    } else {
      getRandomVideo()
        .then((data) => {
          getVideoDetails(data.source);
          setVideo(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      {video && (
        <>
          <YouTube
            videoId={video.source}
            apiKey="AIzaSyBFYI1ucm88RfrhyvT6a1DnTqiuSdtSwSM"
            play
            loop
            rel={false}
            showinfo={false}
            modestbranding
            controls={2}
            onError={(e) => console.log(e)}
            resumePlayAndroid={false}
            style={{alignSelf: 'stretch', height: calculatePlayerHeight()}}
          />
        </>
      )}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {snippet ? snippet.title : 'Loading'}
          </Text>
          <Text
            style={{
              ...textStyles.paragraphMedium,
              color: COLORS.SECONDARY,
              marginVertical: 8,
            }}>
            {video && video.business.display_name}
          </Text>
          <View style={styles.buttonArea}>
            <View style={styles.buttonsLeft}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => toggleLike('liked')}>
                  <Icon
                    name="thumb-up"
                    size={28}
                    color={
                      liked === 'liked' ? COLORS.PRIMARY : COLORS.SECONDARY
                    }
                  />
                </TouchableOpacity>
                <Text style={styles.buttonCaption}>{likes}</Text>
              </View>

              <View style={{...styles.buttonContainer, marginLeft: 24}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => toggleLike('disliked')}>
                  <Icon
                    name="thumb-down"
                    size={28}
                    color={
                      liked === 'disliked' ? COLORS.PRIMARY : COLORS.SECONDARY
                    }
                  />
                </TouchableOpacity>
                <Text style={styles.buttonCaption}>{dislikes}</Text>
              </View>
            </View>
            <View style={styles.buttonsRight}>
              <View style={{...styles.buttonContainer, marginLeft: 24}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    onPressCart();
                  }}>
                  <Icon name="shopping-cart" size={28} color={COLORS.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.buttonCaption}>Buy Now</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.descriptionBox}>
            <Text style={textStyles.paragraphLargeBold}>Description</Text>
            <Text style={textStyles.paragraphMedium}>
              {snippet ? snippet.description : ''}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    marginHorizontal: 20,
    height: WINDOW_HEIGHT,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.BORDER_LIGHT,
    paddingBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    ...textStyles.paragraphLargeBold,
    marginTop: 20,
    maxWidth: '100%',
  },
  buttonArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonsLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    backgroundColor: COLORS.SECONDARY_TRANSPARENT,
    borderRadius: 8,
  },
  buttonCaption: {
    marginTop: 5,
  },
  contentContainer: {
    marginBottom: 50,
  },
});
