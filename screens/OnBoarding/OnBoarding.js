import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Text,
  Animated,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import {GlobalContext} from '../../providers/GlobalContext';

import Navbar from '../../components/Header/Navbar';
import StatusBarWhite from '../../components/StatusBar';
import SecondaryBackground from '../../components/Backgrounds/SecondaryBackground';

import GraphicWelcome from './welcome1.svg';
import GraphicVisit from './welcome2.svg';
import GraphicBook from './welcome3.svg';

import {textStyles, COLORS, buttons} from '../../styles/styles';

const HEADINGS = [
  'Welcome to ShopOut!',
  'Visit any store on your time!',
  'Book your appointment!',
];
const ILLUSTRATIONS = [<GraphicWelcome />, <GraphicVisit />, <GraphicBook />];
const TEXT = [
  'Your window to shopping with safety and wellbeing',
  'Find your preferred shopping destinations and visit at your convenience',
  'Book your time slot and visit in confidence',
];
const NUMBER_OF_PAGES = 3;

const Welcome = () => {
  const {authActions} = React.useContext(GlobalContext);
  const [page, setPage] = useState(0);

  const nextPage = () => {
    fadeOutPage();
    if (page >= NUMBER_OF_PAGES - 1) authActions.setWelcomeShown();
    else {
      setTimeout(() => {
        fadeInPage();
        setPage((prev) => {
          return prev + 1;
        });
      }, 300);
    }
  };
  const fadeInPage = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const fadeOutPage = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fadeInPage();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <SecondaryBackground />
      <StatusBarWhite />

      <ScrollView style={styles.container} scrollEnabled={false}>
        <Navbar type="locked" />

        <View style={styles.contentContainer}>
          <Animated.View style={{...styles.svgContainer, opacity}}>
            {ILLUSTRATIONS[page]}
          </Animated.View>

          <Animated.View style={{...styles.textContainer, opacity}}>
            <Text style={styles.header}>{HEADINGS[page]}</Text>
            <Text style={styles.text}>{TEXT[page]}</Text>
          </Animated.View>

          <View style={styles.buttonArea}>
            <View style={styles.indicatorContainer}>
              <View style={styles.indicatorFilled}></View>
              <View
                style={
                  page > 0 ? styles.indicatorFilled : styles.indicator
                }></View>
              <View
                style={
                  page > 1 ? styles.indicatorFilled : styles.indicator
                }></View>
            </View>
            <TouchableOpacity
              style={{...buttons.roundedPrimaryButton}}
              onPress={() => {
                nextPage();
              }}>
              <Text style={{...textStyles.roundedButtonText}}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                authActions.setWelcomeShown();
              }}>
              <Text style={{...textStyles.link, marginTop: 20}}>
                {page < NUMBER_OF_PAGES - 1 && 'Skip'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: Dimensions.get('screen').height,
    backgroundColor: COLORS.WHITE,
  },
  contentContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    height: Dimensions.get('window').height - 240,
    marginTop: 80,
  },
  svgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...textStyles.subHeaderBold,
    color: COLORS.PRIMARY,
    marginTop: 20,
  },
  text: {
    ...textStyles.paragraphLarge,
    color: COLORS.PRIMARY,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '100',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  indicator: {
    paddingVertical: 1,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.5,
  },
  indicatorFilled: {
    paddingVertical: 1,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default Welcome;
