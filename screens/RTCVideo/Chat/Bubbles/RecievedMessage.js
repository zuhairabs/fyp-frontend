import React from 'react';
import {View, Text} from 'react-native';
import HyperLink from 'react-native-hyperlink';
import {navigateToExternalLink} from '../Controller';
import styles from '../Styles';

const RecievedMessage = ({message}) => (
  <View style={{...styles.messageBubble, ...styles.recievedmessageBubble}}>
    <HyperLink
      linkStyle={styles.recievedMessageLink}
      onPress={(url) => navigateToExternalLink(url)}>
      <Text style={{...styles.messageText, ...styles.recievedMessageText}}>
        {message.text}
      </Text>
    </HyperLink>
  </View>
);

export default RecievedMessage;
