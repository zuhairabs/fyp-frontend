import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView} from 'react-native';
import styles from './Styles';
import {dummyData} from './Constants';
import ChatBox from './Body/ChatBox';
import Input from './Body/Input';
import Header from './Header/Header';
import {init} from './Controller';

export default ({closeChatBox, channel}) => {
  const [text, setText] = useState('');
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);

  const constructNewMessage = async (text) => {
    return {
      text,
      time: new Date(),
      sent: true,
      sender: 'username',
    };
  };
  const sendMessage = async () => {
    dummyData.push(await constructNewMessage(text));
    setText('');
  };

  useEffect(() => {
    init(channel);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      enabled={keyboardEnabled}>
      <Header title="Store Manager" closeChatBox={closeChatBox} />
      <View style={styles.body}>
        <ChatBox messages={dummyData} />
        <Input
          text={text}
          setText={setText}
          sendMessage={sendMessage}
          setKeyboardEnabled={setKeyboardEnabled}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
