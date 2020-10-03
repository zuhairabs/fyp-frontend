import React from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';
import styles from './Styles';
import {textStyles} from '../../styles/styles';

export default ({stores, title}) => (
  <>
    {stores && stores.length > 0 && (
      <Text
        style={{
          marginTop: 10,
          textTransform: 'uppercase',
          color: '#666',
          ...styles.paddedContainer,
          ...textStyles.paragraphMediumBold,
        }}>
        {title}
      </Text>
    )}
    <FlatList
      data={stores}
      renderItem={({item}) => <StoreCard store={item} />}
      keyExtractor={(item) => item._id}
      bounces={true}
      initialNumToRender={0}
      maxToRenderPerBatch={4}
      style={styles.paddedContainer}
    />
  </>
);
