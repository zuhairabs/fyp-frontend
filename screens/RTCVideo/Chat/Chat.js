import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GiftedChat} from 'react-native-gifted-chat';
import {GlobalContext} from '../../../providers/GlobalContext';
import styles from './Styles';
import Header from './Header';
import {init, navigateToExternalLink} from './Controller';
import {COLORS, textStyles} from '../../../styles/styles';

const emptyMessages = [
  {
    text: 'start a conversation',
    user: {
      _id: 0,
    },
    system: true,
  },
];

export default ({closeChatBox, channel}) => {
  const {state} = useContext(GlobalContext);
  const {_id, firstName, lastName} = state.user;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (newMessage = []) => {
    const {text, user} = newMessage[0];
    setMessages(GiftedChat.append(messages, newMessage));
    firestore().collection('THREADS').doc(channel).collection('MESSAGES').add({
      text,
      createdAt: new Date().getTime(),
      user,
    });
  };

  useEffect(() => {
    const messagesListener = async (channel) => {
      await init(channel);
      firestore()
        .collection('THREADS')
        .doc(channel)
        .collection('MESSAGES')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => {
            const firebaseData = doc.data();
            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date(),
              ...firebaseData,
            };
            return data;
          });
          if (messages.length === 0) setMessages(emptyMessages);
          else setMessages(messages);
          setLoading(false);
        });
    };
    messagesListener(channel);
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Store Manager" closeChatBox={closeChatBox} />
      <View style={styles.body}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={textStyles.paragraphMedium}>Fetching messages</Text>
          </View>
        ) : (
          <GiftedChat
            messages={messages}
            user={{
              _id,
              name: `${firstName} ${lastName}`,
            }}
            onSend={(newMessage) => sendMessage(newMessage)}
            isLoadingEarlier={loading}
            multiline={false}
            parsePatterns={(linkStyle) => [
              {
                type: 'url',
                style: linkStyle,
                onPress: (url) => navigateToExternalLink(url),
              },
            ]}
            renderAvatar={() => <></>}
          />
        )}
        <KeyboardAvoidingView
          enabled={Platform.OS === 'android'}
          behavior="padding"
          keyboardVerticalOffset={120}
        />
      </View>
    </View>
  );
};
