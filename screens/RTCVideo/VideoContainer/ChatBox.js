import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS, textStyles} from '../../../styles/styles';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {FlatList, TextInput} from 'react-native-gesture-handler';

let dummyData = [
  {
    text: 'Hello! can you send me the link for the product?',
    time: new Date(),
    sent: true,
    sender: 'Suryansh Sugandhi',
  },
  {
    text: 'Hi',
    time: new Date(),
    sent: false,
    sender: 'Nike Store',
  },
  {
    text: 'https://suryansh.codes',
    time: new Date(),
    sent: false,
    sender: 'Nike Store',
  },
];

const Header = ({title, closeChatBox}) => (
  <View style={styles.header}>
    <View style={styles.statusLight} />
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity onPress={() => closeChatBox()}>
      <Icon name="close" size={20} color={COLORS.WHITE} />
    </TouchableOpacity>
  </View>
);

const Input = ({text, setText, sendMessage}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.inputBox}
      placeholder="Send a message"
      returnKeyType="send"
      value={text}
      onChangeText={(val) => setText(val)}
      onSubmitEditing={() => sendMessage()}
    />
  </View>
);

const SentMessage = ({message}) => (
  <View style={{...styles.messageContainer, ...styles.sentMessageContainer}}>
    <Text style={{...styles.messageText, ...styles.sentMessageText}}>
      {message.text}
    </Text>
  </View>
);
const RecievedMessage = ({message}) => (
  <View
    style={{...styles.messageContainer, ...styles.recievedMessageContainer}}>
    <Text style={{...styles.messageText, ...styles.recievedMessageText}}>
      {message.text}
    </Text>
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
  const constructNewMessage = (text) => {
    return {
      text,
      time: new Date(),
      sent: true,
      sender: 'Suryansh Sugandhi',
    };
  };
  const sendMessage = () => {
    dummyData.push(constructNewMessage(text));
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header title="Store Manager" closeChatBox={closeChatBox} />
      <View style={styles.body}>
        <MessageBox messages={dummyData} />
        <Input text={text} setText={setText} sendMessage={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: 25,
    backgroundColor: COLORS.WHITE,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
  inputContainer: {
    // backgroundColor: COLORS.PRIMARY_TRANSPARENT,
  },
  inputBox: {
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
  },
  messageBox: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 5,
    justifyContent: 'space-between',
    flex: 1,
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  recievedMessageContainer: {
    alignItems: 'flex-start',
  },
  messageText: {
    ...textStyles.paragraphMedium,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: '60%',
  },
  sentMessageText: {
    color: COLORS.WHITE,
    backgroundColor: COLORS.PRIMARY,
  },
  recievedMessageText: {
    color: COLORS.BLACK,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
});
