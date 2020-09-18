import React from 'react';
import VideoMasonry from '../../../../components/VideoMasonry';
import StoreList from '../../StoreList';
import VideoCardScroll from '../../VideoCardScroll';

export default ({results}) => (
  <>
    <VideoMasonry videos={results.videos} />
    <VideoCardScroll videos={results.relatedVideos} title="Related Videos" />
  </>
);
