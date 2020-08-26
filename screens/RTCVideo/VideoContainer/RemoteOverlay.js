import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {textStyles} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
    <Text style={styles.overlayButtonText}>{title}</Text>
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

const OverlayText = ({text}) => <Text style={styles.overlayText}>{text}</Text>;

export default ({time, title, name, overlayFunctions, localSettings}) => (
  <View style={styles.remoteOverlay}>
    <View>
      <OverlayText text={name} />
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
  </View>
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
  overlayText: {
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    ...textStyles.paragraphMediumBold,
  },
  capsule: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 15,
  },
});
