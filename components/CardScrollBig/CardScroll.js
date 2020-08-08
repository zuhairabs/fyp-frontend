import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, ScrollView, View, ActivityIndicator} from 'react-native';
import {URI} from '../../api/constants';
import BigCard, {BigCardLoading} from './BigCard';

export const CardScrollLoading = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}>
        <BigCardLoading />
      </ScrollView>
    </View>
  );
};

const CardScroll = (props) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getFeaturedStores();
  }, []);

  const changeCard = () => {
    // const changeCurrent = async () => {
    //     setCurrent(prev => (prev === stores.length - 1 ? 0 : prev + 1));
    // }
    // setInterval(() => {
    //     changeCurrent().then(() => {
    //         scrollRef.current?.scrollTo({
    //             animated: true,
    //             y: 0,
    //             x: Dimensions.get('window').width * current,
    //         })
    //     })
    // }, 3000);
  };

  const setSelected = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    setCurrent(Math.floor(contentOffset / viewSize));
  };

  const getFeaturedStores = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: 'Mumbai',
      }),
    };
    try {
      fetch(`${URI}/user/home/featured`, requestOptions).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => setStores(data.response));
          setLoading(false);
        } else console.log(res.statusText);
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {!loading && (
        <View style={styles.indicatorContainer}>
          {stores.map((_store, index) => {
            return (
              <View
                key={index + 20}
                style={
                  current === index
                    ? styles.indicatorSelected
                    : styles.indicator
                }
              />
            );
          })}
        </View>
      )}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setSelected(e);
        }}>
        {loading ? (
          <BigCardLoading />
        ) : (
          <>
            {stores.map((store, _) => {
              return (
                <BigCard
                  key={store._id}
                  store={store}
                  navigation={props.navigation}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
    marginVertical: 5,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 52, //card border radius + card margin horizontal
    zIndex: 2,
    width: 55,
  },
  indicatorSelected: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#0062FF',
    borderRadius: 6,
    opacity: 1,
  },
  indicator: {
    paddingRight: 2,
    paddingLeft: 3,
    borderWidth: 1,
    borderColor: '#0062FF',
    opacity: 0.5,
    borderRadius: 6,
  },
});

export default CardScroll;
