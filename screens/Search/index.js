import React, {useEffect, useState, useRef, useContext} from 'react';
import {View, ScrollView, ActivityIndicator, ToastAndroid} from 'react-native';
import {GlobalContext} from '../../providers/GlobalContext';

import {Post} from '../../api/http';
import {fullSearchAPI, partialSearchDelayed} from './controllers';

import StatusBarWhite from '../../components/StatusBar';
import SearchBox from './SearchBox';
import Results from './Results';
import styles from './Styles';
import Header from './Header';

export default (props) => {
  const {initial, autoFocus} = props.route.params;
  const inputBox = useRef();
  const {state} = useContext(GlobalContext);

  const [dropdownOpen, setDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState();
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (!initial) getUserHistory();
    else fullSearchStore(initial.query);
  }, []);

  const getUserHistory = () => {
    const phone = state.user.phone;
    const body = JSON.stringify({
      cred: {phone},
    });
    Post('user/store/history/fetch', body, state.token)
      .then((data) => setResults(data.response))
      .catch(() => setResults([]));
    setLoading(false);
  };

  const clearPartialSearchResults = () => {
    inputBox.current?.blur();
    setSuggestions([]);
    setDropdown(false);
    setText('');
  };

  const fullSearchStore = (query) => {
    setLoading(true);
    clearPartialSearchResults();
    fullSearchAPI(query, 'store')
      .then((response) => {
        clearPartialSearchResults();
        setResults(response);
        setLoading(false);
        setQuery(query);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const handleTextChange = async (query) => {
    setText(query);
    partialSearchDelayed(query)
      .then((response) => {
        setDropdown(true);
        setSuggestions(response);
      })
      .catch((e) => ToastAndroid.show(e), ToastAndroid.SHORT);
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <SearchBox
        handleTextChange={handleTextChange}
        clearPartialSearchResults={clearPartialSearchResults}
        inputBox={inputBox}
        autoFocus={autoFocus}
        text={text}
        fullSearchStore={fullSearchStore}
        dropdownOpen={dropdownOpen}
        suggestions={suggestions}
      />

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="#0062FF" />
          </View>
        ) : (
          <>
            <Header query={query} />
            <Results results={results} />
          </>
        )}
      </ScrollView>
    </View>
  );
};
