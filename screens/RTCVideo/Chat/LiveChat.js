/*eslint-disable*/
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import styles from './Styles';
import { init, navigateToExternalLink } from './Controller';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import SendButton from '../../../components/UXComponents/svg/send-button.svg';
import { GlobalContext } from './../../../providers/GlobalContext';

const emptyMessages = [
  {
    text: 'Ask your queries. Learn more about this great product.',
    user: {
      _id: 0,
    },
    system: true,
  },
];

export default ({ channel }) => {
  const { state } = useContext(GlobalContext);
  const { _id, firstName, lastName } = state.user;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (newMessage = []) => {
    const { text, user } = newMessage[0];
    setMessages(GiftedChat.append(messages, newMessage));
    firestore().collection('THREADS').doc(channel).collection('MESSAGES').add({
      text,
      createdAt: new Date().getTime(),
      user,
    });
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ borderWidth: 0 }}>
        <View
          style={{
            marginRight: 7,
            marginBottom: 9,
            borderRadius: 0,
          }}>
          <SendButton height={25} width={38} />
        </View>
      </Send>
    );
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        textStyle={{
          backgroundColor: 'white',
        }}
        placeholderTextColor="#fff"
        textInputStyle={{ color: '#fff', fontSize: 15 }}
        containerStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
          borderWidth: 3,
          borderTopWidth: 3,
          borderTopColor: '#fff',
          borderColor: '#fff',
        }}
        placeholder="Say Something..."
      />
    );
  };

  const renderBubble = (props) => {
    if (props.currentMessage.user._id !== _id) {
      return (
        <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: -15 }}>
          <Text
            style={{
              paddingLeft: 10,
              color: 'white',
              marginBottom: -5,
              fontFamily: 'CircularStd-Bold',
            }}>
            {props.currentMessage.user.name}
          </Text>
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: 'white',
                fontWeight: '400',
                borderRadius: 20,
                fontFamily: 'CircularStd-Bold',
              },
              left: {
                color: 'white',
                fontWeight: '400',
                borderRadius: 20,
                fontFamily: 'CircularStd-Bold',
              },
            }}
            wrapperStyle={{
              left: { backgroundColor: 'transparent' },
            }}
          />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Text
          style={{
            paddingLeft: 10,
            color: 'white',
            marginBottom: -5,
            fontFamily: 'CircularStd-Bold',
          }}>
          {props.currentMessage.user.name}
        </Text>
        <Bubble
          {...props}
          position="left"
          textStyle={{
            right: {
              color: 'white',
              fontWeight: '400',
              borderRadius: 20,
              fontFamily: 'CircularStd-Bold',
            },
            left: {
              color: 'white',
              fontWeight: '400',
              fontFamily: 'CircularStd-Bold',
              borderRadius: 20,
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: 'transparent',
              borderRadius: 20,
              marginRight: 60,
              minHeight: 20,
              justifyContent: 'flex-end',
            },
            left: {
              backgroundColor: 'transparent',
              flex: 1,
            },
          }}
        />
      </View>
    );
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
    return () => { };
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: 'transparent' }}>
      <View style={styles.body}>
        {loading ? (
          <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color={COLORS.PRIMARY} /> */}
          </View>
        ) : (
          <View style={{ zIndex: 1, flex: 1 }}>
            <MaskedView
              style={{ flex: 1 }}
              maskElement={
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
                  style={{
                    flex: 1,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  locations={[0, 0.5]}
                />
              }>
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
                renderAvatar={() => null}
                showAvatarForEveryMessage
                showUserAvatar={false}
                alwaysShowSend
                renderSend={(props) => renderSend(props)}
                renderInputToolbar={(props) => customtInputToolbar(props)}
                timeTextStyle={{
                  left: { color: 'black', fontSize: 0 },
                  right: { color: 'black', fontSize: 0 },
                }}
                renderBubble={(props) => renderBubble(props)}
              />
              <KeyboardAvoidingView
                enabled={Platform.OS === 'android'}
                behavior="padding"
                keyboardVerticalOffset={120}
              />
            </MaskedView>
          </View>
        )}
      </View>
    </View>
  );
};
