import React from 'react';
import VideoCardScroll from '../../../../components/Carousel/VideoCardScroll';
import VideoMasonry from '../../../../components/VideoMasonry';

export default ({results}) => (
  <>
    <VideoMasonry videos={results.videos} />
    <VideoCardScroll videos={results.relatedVideos} title="Related Videos" />
  </>
);
