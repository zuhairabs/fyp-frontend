import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Post} from '../../api/http';
import DummyTile from '../Carousel/DummyTile';
import StoreTile from '../Carousel/StoreTile';

const CardScroll = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getFeaturedStores();
  }, []);

  const setSelected = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    setCurrent(Math.floor(contentOffset / viewSize));
  };

  const getFeaturedStores = () => {
    const body = JSON.stringify({city: 'Mumbai'});
    Post('app/home/store/featured', body).then(
      (data) => {
        setStores(data.response);
        setLoading(false);
      },
      (e) => {
        console.log(e);
      },
    );
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
          <DummyTile />
        ) : (
          <>
            {stores.map((store, _) => {
              return <StoreTile key={store._id} store={store} />;
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
