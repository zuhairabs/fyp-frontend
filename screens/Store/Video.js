import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Text,
  Linking,
} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Share from 'react-native-share';
import YouTube from 'react-native-youtube';
import {URI} from '../../api/constants';

import {COLORS, textStyles, SPACING, BORDER_RADIUS} from '../../styles/styles';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT =
  DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);

const YT_API = {
  KEY: 'AIzaSyBFYI1ucm88RfrhyvT6a1DnTqiuSdtSwSM',
  URI: {
    SNIPPET: 'https://www.googleapis.com/youtube/v3/videos?part=snippet',
  },
};

const shareVideo = () => {
  const options = {
    message:
      'I found this amazing product on ShopOut! Want to try it out? Click here!',
    title: 'Try out the ShopOut app',
    url: 'https://shopout.co.in',
  };
  Share.open(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
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
  const [fullScreen, toggleFullScreen] = useState(false);

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
            fullscreen={fullScreen}
            onChangeFullscreen={(e) => toggleFullScreen(e.isFullscreen)}
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
          <TouchableOpacity
            style={styles.link}
            onPress={() => toggleFullScreen(true)}>
            <Text
              style={{...styles.linkText, ...textStyles.paragraphMediumBold}}>
              Watch in full screen
            </Text>
          </TouchableOpacity>
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

              <View style={{...styles.buttonContainer, marginLeft: 24}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => shareVideo()}>
                  <Icon name="share" size={28} color={COLORS.SECONDARY} />
                </TouchableOpacity>
                <Text style={styles.buttonCaption}>Share</Text>
              </View>
            </View>
            <View style={styles.buttonsRight}>
              <View style={{...styles.buttonContainer, marginLeft: 24}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    video.link && Linking.openURL(video.link);
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
      <View style={buttonStyles.buttonArea}>
        <TouchableOpacity
          style={buttonStyles.primaryButton}
          onPress={() => onPressCart()}>
          <Text style={buttonStyles.primaryButtonText}>Go to store</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonStyles.secondaryButton}
          onPress={() => onPressCart()}>
          <Text style={buttonStyles.secondaryButtonText}>Video Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    marginHorizontal: 20,
    height: WINDOW_HEIGHT,
  },
  header: {
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
    marginTop: 10,
    maxWidth: '100%',
  },
  link: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  buttonArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 120,
  },
});

const buttonStyles = StyleSheet.create({
  buttonArea: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    elevation: 10,
    bottom: NAVIGATION_HEIGHT,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: NAVIGATION_HEIGHT - 30 > 0 ? NAVIGATION_HEIGHT - 30 : 30,
  },
  primaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    padding: SPACING.m,
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    borderWidth: SPACING.xxs,
    padding: SPACING.m - SPACING.xxs,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.WHITE,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
  },
});
