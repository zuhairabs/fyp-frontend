import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {textStyles} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

String.prototype.formatTimeString = function () {
  var sec_num = parseInt(this, 10);
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - minutes * 60;

  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return `${minutes}:${seconds}`;
};

const emptyFunction = () => console.log('Button pressed');

const Capsule = ({title}) => (
  <TouchableOpacity style={styles.capsule}>
    <Text style={styles.overlayText}>{title}</Text>
  </TouchableOpacity>
);

const OverlayButton = ({title, iconName, buttonFunction = emptyFunction}) => (
  <TouchableOpacity
    style={styles.overlayButton}
    onPress={() => {
      buttonFunction();
      console.log(buttonFunction);
    }}>
    <>
      {iconName && <Icon name={iconName} size={24} color="#FFF" />}
      {title && <Text style={styles.overlayButtonText}>{title}</Text>}
    </>
  </TouchableOpacity>
);

const OverlayText = ({text, size = 'medium'}) => (
  <Text
    style={size === 'medium' ? styles.overlayText : styles.overlayTextLarge}>
    {text}
  </Text>
);

export default ({
  time,
  title,
  name,
  overlayFunctions,
  localSettings,
  overlayOpacity,
  toggleOverlay,
}) => (
  <TouchableWithoutFeedback onPress={() => toggleOverlay()}>
    <Animated.View style={{...styles.remoteOverlay, opacity: overlayOpacity}}>
      <View>
        <OverlayText text={name} size="large" />
        <OverlayText text={title} />
        <Capsule title={time.toString().formatTimeString()} />
      </View>
      <View>
        <OverlayButton
          iconName={localSettings.localVideo ? 'videocam' : 'videocam-off'}
          buttonFunction={overlayFunctions.toggleLocalVideo}
        />
        <OverlayButton
          iconName={localSettings.localAudio ? 'mic' : 'mic-off'}
          buttonFunction={overlayFunctions.toggleLocalAudio}
        />
      </View>
    </Animated.View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  remoteOverlay: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 15,
    height: 48,
  },
  overlayButtonText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphMediumBold,
  },
  overlayTextLarge: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphLarge,
  },
  overlayText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphMedium,
  },
  capsule: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 15,
    width: 80,
  },
});
