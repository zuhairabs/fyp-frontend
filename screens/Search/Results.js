import React from 'react';
import {View} from 'react-native';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';
import styles from './Styles';
import EmptyResults from './EmptyResults';

export default ({results}) => (
  <View style={styles.searchResult}>
    {results.length > 0 ? (
      results.map((item) => (
        <StoreCard key={item._id} store={item} searched={true} />
      ))
    ) : (
      <EmptyResults />
    )}
  </View>
);
