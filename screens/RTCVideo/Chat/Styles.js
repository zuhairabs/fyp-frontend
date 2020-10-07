import {StyleSheet} from 'react-native';
import {COLORS, textStyles} from '../../../styles/styles';

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

export default styles;
