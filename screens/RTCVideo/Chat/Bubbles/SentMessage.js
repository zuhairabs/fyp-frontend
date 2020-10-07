import React from 'react';
import {View, Text} from 'react-native';
import HyperLink from 'react-native-hyperlink';
import {navigateToExternalLink} from '../Controller';
import styles from '../Styles';

const SentMessage = ({message}) => (
  <View style={{...styles.messageBubble, ...styles.sentmessageBubble}}>
    <HyperLink
      linkStyle={styles.sentMessageLink}
      onPress={(url) => navigateToExternalLink(url)}>
      <Text style={{...styles.messageText, ...styles.sentMessageText}}>
        {message.text}
      </Text>
    </HyperLink>
  </View>
);

export default SentMessage;
