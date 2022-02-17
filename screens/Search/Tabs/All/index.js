/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import CardScroll from '../../../../components/Carousel/Card/CardScroll';
import VideoMasonry from '../../../../components/VideoMasonry';
import StoreList from '../../StoreList';
import {Dimensions, Image, View, Text} from 'react-native';

export default ({results}) => (
  <>
    {results?.stores?.length ? (
      <>
        <CardScroll data={results.videos} title="Videos" videos={true} />
        <StoreList stores={results.stores} title="stores" />
        <VideoMasonry videos={results.relatedVideos} title="related" />
      </>
    ) : (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 480,
            justifyContent: 'center',
            flex: 1,
            marginTop: 120,
          }}>
          <Image
            source={require('../../../../components/UXComponents/svg/EmptyPage.png')}
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              color: '#666',
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 20,
              paddingHorizontal: 40,
              fontSize: 16,
            }}>
            No Stores Found!
          </Text>
        </View>
      </View>
    )}
  </>
);
