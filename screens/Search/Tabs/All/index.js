import React from 'react';
import VideoMasonry from '../../../../components/VideoMasonry';
import StoreList from '../../StoreList';
import VideoCardScroll from '../../VideoCardScroll';

export default ({results}) => (
  <>
    <VideoCardScroll videos={results.videos} title="Videos" />
    <StoreList stores={results.stores} title="stores" />
    <VideoMasonry videos={results.relatedVideos} title="related" />
  </>
);
