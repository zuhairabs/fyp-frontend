import React, {useState, createRef, useEffect} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Post} from '../../../api/http';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const fetchImages = (_id) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({storeData: {_id}});
    Post('app/store/fetch/images', body)
      .then((data) => resolve(data))
      .catch((e) => reject(e));
  });
};

const ImageHeader = ({title_image, height, store}) => {
  const [images, setImages] = useState([]);
  const [headerImage, setHeaderImage] = useState(0);
  const scrollRef = createRef();

  const changeImage = (number) => {
    scrollRef.current.scrollTo({
      animated: true,
      y: 0,
      x: WINDOW_WIDTH * number,
    });
    setHeaderImage(number);
  };

  const setSelected = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    setHeaderImage(Math.floor(contentOffset / viewSize));
  };

  useEffect(() => {
    setImages([title_image]);
    fetchImages(store).then((res) => {
      setImages(res.store.business.images);
    });
  }, []);

  return (
    <View>
      <View style={styles.headerImageContainer}>
        <ScrollView
          horizontal
          decelerationRate="fast"
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setSelected(e);
          }}
          ref={scrollRef}>
          {images.map((img, i) => {
            return (
              <View
                key={i}
                style={{
                  height: height,
                  width: WINDOW_WIDTH,
                }}>
                <Image
                  style={styles.headerImage}
                  source={{uri: `data:image/gif;base64,${img}`}}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.carousel}>
        {images.map((img, index) => {
          return (
            <View key={index} style={styles.carouselImageContainer}>
              <TouchableOpacity
                style={styles.carouselTouchable}
                onPress={() => {
                  changeImage(index);
                }}>
                <Image
                  source={{uri: `data:image/gif;base64,${img}`}}
                  style={
                    headerImage === index
                      ? styles.carouselImage
                      : {...styles.carouselImage, opacity: 0.3}
                  }
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerImageContainer: {
    backgroundColor: '#FEFEFE6F',
    flexDirection: 'row',
  },
  image: {},
  headerImage: {
    height: undefined,
    width: '100%',
    flex: 1,
  },
  carousel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: Math.floor(WINDOW_HEIGHT / 9),
    marginTop: 20,
  },
  carouselImageContainer: {
    marginHorizontal: 8,
    borderColor: '#66666666',
    borderRadius: 15,
    width: WINDOW_WIDTH / 4 - 16,
  },
  carouselTouchable: {
    height: '100%',
  },
  carouselImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderRadius: 15,
  },
});

export default ImageHeader;
