import React from 'react';
import CardScroll from '../../../../components/Carousel/Card/CardScroll';
import VideoMasonry from '../../../../components/VideoMasonry';
import StoreList from '../../StoreList';

export default ({results}) => (
  <>
    <CardScroll data={results.videos} title="Videos" videos={true} />
    <StoreList stores={results.stores} title="stores" />
    <VideoMasonry videos={results.relatedVideos} title="related" />
  </>
);
