import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, textStyles} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import HyperLink from 'react-native-hyperlink';
import {navigationRef} from '../../../Navigation/Navigation';
import {chatBoxRef} from './VideoContainer';

const dummyData = [
  {
    text: 'Hello! can you send me the link for the product?',
    time: new Date(),
    sent: true,
    sender: 'username',
  },
  {
    text:
      'https://www.nike.com/in/t/air-zoom-unvrs-flyease-basketball-shoe-PfW4Rr/CQ6422-600',
    time: new Date(),
    sent: false,
    sender: 'Nike Store',
  },
  {
    text: 'Thank You',
    time: new Date(),
    sent: true,
    sender: 'username',
  },
  {
    text: 'How else may I help you?',
    time: new Date(),
    sent: false,
    sender: 'Nike Store',
  },
  {
    text: "That's all! I will check it out",
    time: new Date(),
    sent: true,
    sender: 'username',
  },
];

const navigateToExternalLink = (uri, title = 'External link') => {
  navigationRef.current?.navigate('FullScreenWebView', {
    title,
    uri,
  });
  chatBoxRef.current?.close();
};

const Header = ({title, closeChatBox}) => (
  <View style={styles.header}>
    <View style={styles.statusLight} />
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity onPress={() => closeChatBox()}>
      <Icon name="close" size={20} color={COLORS.WHITE} />
    </TouchableOpacity>
  </View>
);

const Input = ({text, setText, sendMessage, setKeyboardEnabled}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.inputBox}
      placeholder="Send a message"
      returnKeyType="send"
      value={text}
      onChangeText={(val) => setText(val)}
      onSubmitEditing={() => sendMessage()}
      onFocus={() => setKeyboardEnabled(true)}
      onBlur={() => setKeyboardEnabled(false)}
    />
  </View>
);

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

const Message = ({message}) => {
  if (message.sent) return <SentMessage message={message} />;
  else return <RecievedMessage message={message} />;
};

const MessageBox = ({messages}) => (
  <FlatList
    data={messages}
    renderItem={({item}) => <Message message={item} />}
    style={styles.messageBox}
  />
);

export default ({closeChatBox}) => {
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
  return (
    <KeyboardAvoidingView
      behavior="height"
      style={styles.container}
      enabled={keyboardEnabled}>
      <Header title="Store Manager" closeChatBox={closeChatBox} />
      <View style={styles.body}>
        <MessageBox messages={dummyData} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  headerTitle: {
    ...textStyles.paragraphLarge,
    color: COLORS.WHITE,
  },
  statusLight: {
    backgroundColor: COLORS.GREEN,
    padding: 6,
    borderRadius: 10,
  },
  body: {
    flex: 1,
  },
  inputContainer: {
    // marginTop: 8,
    marginBottom: 20,
  },
  inputBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  messageBox: {
    paddingHorizontal: 20,
    marginTop: 8,
    height: '75%',
  },
  messageBubble: {
    marginVertical: 5,
    justifyContent: 'space-between',
    flex: 1,
  },
  sentmessageBubble: {
    alignItems: 'flex-end',
  },
  recievedmessageBubble: {
    alignItems: 'flex-start',
  },
  messageText: {
    ...textStyles.paragraphMedium,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: '65%',
  },
  sentMessageText: {
    color: COLORS.WHITE,
    backgroundColor: COLORS.PRIMARY,
  },
  sentMessageLink: {
    color: COLORS.GREEN,
  },
  recievedMessageText: {
    color: COLORS.BLACK,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  recievedMessageLink: {
    color: COLORS.PRIMARY,
  },
});
