import React, {useState, createRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import StatusBarWhite from '../../components/StatusBar';
import {GlobalContext} from '../../providers/GlobalContext';

const Support = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const sendRequest = () => {
    if (title.length > 0 && text.length > 0)
      fetch(`${URI}/user/support/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supportRequest: {
            user: state.user._id,
            title: title,
            text: text,
          },
        }),
      }).then((res) => {
        if (res.status === 200) {
          ToastAndroid.show('Request Submitted', ToastAndroid.LONG);
          navigation.goBack();
        } else Alert.alert(res.statusText);
      });
    else ToastAndroid.show('All fields are required', ToastAndroid.SHORT);
  };

  const textField = createRef();

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <TextInput
            value={title}
            onChangeText={(val) => {
              setTitle(val);
            }}
            placeholder="Subject"
            onSubmitEditing={() => {
              textField.current.focus();
            }}
            numberOfLines={1}
            autoCompleteType="off"
            returnKeyType="next"
            style={styles.titleInput}
          />

          <TextInput
            ref={textField}
            value={text}
            onChangeText={(val) => setText(val)}
            placeholder="Please explain your issue"
            multiline={true}
            numberOfLines={10}
            textBreakStrategy="highQuality"
            returnKeyType="send"
            style={styles.textInput}
          />
        </KeyboardAvoidingView>

        <Text
          style={{
            color: '#666',
            padding: 20,
          }}>
          Our team is here to help you. Write to us and we will contact you at
          the earliest
        </Text>

        <View style={styles.buttonArea}>
          <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => {
              sendRequest();
            }}>
            <Text style={styles.defaultButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFF',
  },
  container: {
    height: Dimensions.get('window').height,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  titleInput: {
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CAD0D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textInput: {
    width: '100%',
    // height: Math.floor(Dimensions.get("window").height / 2.6,),
    marginTop: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CAD0D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 180,
  },
  defaultButton: {
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0062FF',
    padding: 20,
  },
  defaultButtonText: {
    color: '#FFF',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default Support;
