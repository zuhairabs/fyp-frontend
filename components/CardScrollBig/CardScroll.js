import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Post} from '../../api/http';
import DummyTile from '../Carousel/DummyTile';
import StoreTileScroll from '../Carousel/StoreTileScroll';

const CardScroll = ({item}) => {
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
        <StoreTileScroll title={item.title} stores={results} />
      )}
    </View>
  );
};

export default CardScroll;
