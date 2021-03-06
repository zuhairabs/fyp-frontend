/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';

import StatusBarWhite from '../../components/StatusBar';
import SearchBox from './SearchBox';
import styles from './Styles';
import Header from './Header';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {fullSearchAPI} from './controllers';
import All from './Tabs/All';
import Videos from './Tabs/Videos';
import Stores from './Tabs/Stores';
import EmptyResults from './EmptyResults';
import {GlobalContext} from '../../providers/GlobalContext';
import {COLORS, textStyles} from '../../styles/styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default ({route, navigation}) => {
  const {state} = useContext(GlobalContext);
  const {initial, autoFocus, initialTab} = route.params;
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState();
  const [selectedTab, setSelectedTab] = useState(initialTab ? initialTab : 0);
  const [results, setResults] = useState({});
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (initialTab >= 0) {
        setSelectedTab(initialTab);
        console.log('initial ->', initial);
        if (initial) fullSearch(initial);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const fullSearch = (searchTerm) => {
    console.log('searchTerm ->', searchTerm);
    if (searchTerm && searchTerm.length > 0) {
      setLoading(true);
      setQuery(searchTerm);
      fullSearchAPI(searchTerm, selectedTab.model, state.location || {}).then(
        (response) => {
          console.log(response);
          setResults(response);
          setLoading(false);
        },
      );
    }
  };

  const changeTab = (index) => {
    if (selectedTab !== index) setSelectedTab(index);
  };

  const [tabs] = useState([
    {title: 'All', model: null},
    {title: 'Stores', model: 'store'},
    {title: 'Videos', model: 'video'},
  ]);

  const TabNavigation = () => (
    <View style={styles.tabNavigation}>
      {tabs.map((tab, index) => {
        return (
          <View key={index} style={styles.tab}>
            <TouchableWithoutFeedback
              style={
                index === selectedTab
                  ? styles.tabNavigationObjectSelected
                  : styles.tabNavigationObject
              }
              onPress={() => {
                changeTab(index);
              }}>
              <Text
                style={
                  index === selectedTab
                    ? styles.tabNavigationTextSelected
                    : styles.tabNavigationText
                }
                numberOfLines={1}>
                {tab.title}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        );
      })}
    </View>
  );

  const TabComponent = [
    <All results={results} />,
    <Stores results={results} />,
    <Videos results={results} />,
  ];

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />
      <SearchBox autoFocus={autoFocus} fullSearch={fullSearch} />
      <TabNavigation />
      <ScrollView contentContainerStyle={styles.container}>
        <Header query={query} />
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: WINDOW_HEIGHT - 200,
              width: '100%',
            }}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : (
          <>{TabComponent[selectedTab]}</>
        )}
      </ScrollView>
    </View>
  );
};
