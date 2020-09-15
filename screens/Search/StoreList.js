import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';
import styles from './Styles';
import EmptyResults from './EmptyResults';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS} from '../../styles/styles';
import {fullSearchAPI} from './controllers';

export default ({query}) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fullSearchAPI(query, 'store')
      .then((response) => {
        setStores(response);
        setLoading(false);
      })
      .catch(() => {
        setStores([]);
        setLoading(false);
      });
  }, [query]);

  // const getUserHistory = () => {
  //   const phone = state.user.phone;
  //   const body = JSON.stringify({
  //     cred: {phone},
  //   });
  //   Post('user/store/history/fetch', body, state.token)
  //     .then((data) => setResults(data.response))
  //     .catch(() => setResults([]));
  //   setLoading(false);
  // };

  if (loading)
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );

  return (
    <View style={styles.searchResult}>
      {stores && stores.length > 0 ? (
        <FlatList
          data={stores}
          renderItem={({item}) => <StoreCard store={item} />}
          keyExtractor={(item) => item._id}
          bounces={true}
          initialNumToRender={0}
          maxToRenderPerBatch={4}
        />
      ) : (
        <EmptyResults />
      )}
    </View>
  );
};
