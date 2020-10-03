import React from 'react';
import CardScroll from '../../../../components/Carousel/Card/CardScroll';
import VideoMasonry from '../../../../components/VideoMasonry';

export default ({results}) => (
  <>
    <VideoMasonry videos={results.videos} />
    <CardScroll
      data={results.relatedVideos}
      title="Related Videos"
      videos={true}
    />
  </>
);
