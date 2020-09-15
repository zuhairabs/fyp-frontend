import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';

import StatusBarWhite from '../../components/StatusBar';
import SearchBox from './SearchBox';
import StoreList from './StoreList';
import VideoMasonry from '../../components/VideoMasonry';
import styles from './Styles';
import Header from './Header';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default (props) => {
  const {initial, autoFocus} = props.route.params;
  const [query, setQuery] = useState();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (initial) fullSearch(initial.query);
  }, []);

  const fullSearch = (searchTerm) => {
    setQuery(searchTerm);
  };

  const changeTab = (index) => {
    if (selectedTab !== index) setSelectedTab(index);
  };

  const [tabs] = useState([{title: 'Stores'}, {title: 'Videos'}]);

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

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <SearchBox autoFocus={autoFocus} fullSearch={fullSearch} />

      <ScrollView contentContainerStyle={styles.container}>
        <TabNavigation />
        <Header query={query} />
        {selectedTab === 0 ? (
          <StoreList query={query} />
        ) : (
          <VideoMasonry query={query} />
        )}
      </ScrollView>
    </View>
  );
};
