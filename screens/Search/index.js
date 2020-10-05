import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView, Text, ActivityIndicator} from 'react-native';

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

export default ({route}) => {
  const {state} = useContext(GlobalContext);
  const {initial, autoFocus, initialTab} = route.params;
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState();
  const [selectedTab, setSelectedTab] = useState(initialTab || 0);
  const [results, setResults] = useState({});
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    if (initial) fullSearch(initial);
  }, []);

  const fullSearch = (searchTerm) => {
    if (searchTerm && searchTerm.length > 0) {
      setLoading(true);
      setQuery(searchTerm);
      fullSearchAPI(searchTerm, selectedTab.model, state.location || {}).then(
        (response) => {
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
        {loading ? <ActivityIndicator /> : <>{TabComponent[selectedTab]}</>}
      </ScrollView>
    </View>
  );
};
