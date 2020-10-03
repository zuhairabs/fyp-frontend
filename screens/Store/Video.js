import React, {useState} from 'react';
import {View, Dimensions, Text} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Share from 'react-native-share';
import YouTube from 'react-native-youtube';

import {COLORS, textStyles} from '../../styles/styles';
import {navigationRef} from '../../Navigation/Navigation';
import {buttonStyles, styles} from './VideoStyles';
const WINDOW_WIDTH = Dimensions.get('window').width;

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

export default ({route}) => {
  const {video} = route.params;
  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);
  const [liked, setLiked] = useState('unliked');
  const [fullScreen, toggleFullScreen] = useState(false);

  const calculatePlayerHeight = () => (WINDOW_WIDTH * 9) / 16;

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
      navigationRef.current?.navigate('SearchFull', {
        initial: brand.name,
        autoFocus: false,
        initialTab: 1,
      });
    } else if (tag && tag.name) {
      navigationRef.current?.navigate('SearchFull', {
        initial: tag.name,
        initialTab: 1,
        autoFocus: false,
      });
    }
  };

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
        // stickyHeaderIndices={[0]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.link}
            onPress={() => toggleFullScreen(true)}>
            <Text
              style={{...styles.linkText, ...textStyles.paragraphMediumBold}}>
              Watch in full screen
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>{video.title}</Text>
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
              {video.link && (
                <View style={{...styles.buttonContainer, marginLeft: 24}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigationRef.current?.navigate('FullScreenWebView', {
                        title: video.business.display_name,
                        uri: video.link,
                      })
                    }>
                    <Icon
                      name="shopping-cart"
                      size={28}
                      color={COLORS.PRIMARY}
                    />
                  </TouchableOpacity>
                  <Text style={styles.buttonCaption}>Buy Now</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.descriptionBox}>
            <Text style={textStyles.paragraphLargeBold}>Description</Text>
            <Text style={textStyles.paragraphMedium}>{video.description}</Text>
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
