import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {textStyles, COLORS} from '../../styles/styles';

const BookButton = (props) => (
  <View style={styles.buttonContainer}>
    <View style={styles.bookButton}>
      {props.title ? (
        <Text style={styles.bookButtonText}>{props.title}</Text>
      ) : (
        <Text style={styles.bookButtonText}>BOOK SLOT</Text>
      )}
      <View style={styles.bookButtonUnderline}></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-start',
  },
  bookButton: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 5,
  },
  bookButtonText: {
    textTransform: 'uppercase',
    marginBottom: 5,
    ...textStyles.paragraphExtraSmall,
  },
  bookButtonUnderline: {
    borderBottomWidth: 2,
    marginHorizontal: '10%',
    borderColor: '#1162FB',
  },
});

export default BookButton;
