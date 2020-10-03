import React from 'react';
import VideoCardScroll from '../../../../components/Carousel/VideoCardScroll';
import VideoMasonry from '../../../../components/VideoMasonry';
import StoreList from '../../StoreList';

export default ({results}) => (
  <>
    <VideoCardScroll videos={results.videos} title="Videos" />
    <StoreList stores={results.stores} title="stores" />
    <VideoMasonry videos={results.relatedVideos} title="related" />
  </>
);
