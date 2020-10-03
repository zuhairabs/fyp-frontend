import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Post} from '../../api/http';
import DummyTile from '../Carousel/Tile/DummyTile';
import TileScroll from '../Carousel/Tile/TileScroll';

const Tiles = ({item, videos}) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchAPIResults();
  }, []);

  const fetchAPIResults = async () => {
    const body = JSON.stringify({city: 'Mumbai'});
    try {
      const data = await Post(item.uri, body);
      setResults(data.response);
      setLoading(false);
    } catch (e) {
      setLoading(true);
      console.log(e);
    }
  };

  return (
    <View style={{marginVertical: 5}}>
      {loading ? (
        <DummyTile />
      ) : (
        <TileScroll title={item.title} data={results} videos={videos} />
      )}
    </View>
  );
};

export default Tiles;
