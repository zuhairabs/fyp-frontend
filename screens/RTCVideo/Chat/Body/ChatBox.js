import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import styles from '../Styles';
import Bubble from '../Bubbles/Bubble';

const ChatBox = ({messages}) => (
  <FlatList
    data={messages}
    renderItem={({item}) => <Bubble message={item} />}
    style={styles.messageBox}
  />
);

export default ChatBox;
