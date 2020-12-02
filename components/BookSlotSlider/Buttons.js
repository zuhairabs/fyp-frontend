import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BORDER_RADIUS, COLORS, SPACING} from '../../styles/styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT =
  DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);

const BookSlotButtons = ({
  primaryFunction,
  primaryTitle,
  secondaryTitle,
  secondaryFunction
}) => {
  return (
    <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={primaryFunction}>
          <Text style={styles.primaryButtonText}>{primaryTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={secondaryFunction}>
          <Text style={styles.secondaryButtonText}>{secondaryTitle}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonArea: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    elevation: 10,
    bottom: NAVIGATION_HEIGHT,
    width: '100%',
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    padding: 10,
    paddingBottom: NAVIGATION_HEIGHT - 30 > 0 ? NAVIGATION_HEIGHT - 30 : 30,
  },
  primaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    padding: SPACING.m,
    backgroundColor: COLORS.PRIMARY,
  },
  secondaryButton: {
    flex: 1,
    width: WINDOW_WIDTH / 2 - 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.s,
    borderWidth: SPACING.xxs,
    padding: SPACING.m - SPACING.xxs,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.WHITE,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    fontFamily: 'Roboto-Black',
    color: COLORS.PRIMARY,
    textTransform: 'uppercase',
  },
});

export default BookSlotButtons;
