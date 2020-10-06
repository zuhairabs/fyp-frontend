import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Dimensions, ActivityIndicator, Image} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';

import {GlobalContext} from '../../providers/GlobalContext';
import StatusBarWhite from '../../components/StatusBar';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';
import {Post} from '../../api/http';
import styles from './Styles';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const Categories = ({route}) => {
  const {state} = useContext(GlobalContext);

  const {title, list} = route.params;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [current, setCurrent] = useState(title);

  const fetchResults = (name) => {
    setLoading(true);
    const {lat, long} = state.location || {lat: null, long: null};
    const base = 'app/home/store/category/single';
    let route = base + `?name=${name}&lat=${lat}&long=${long}`;
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
    });
    Post(route, body, state.token).then((data) => {
      setResults(data.response);
      setLoading(false);
      setCurrent(name);
      setDropdown(false);
    });
  };

  useEffect(() => {
    fetchResults(title);
  }, [route.params]);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      {loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: WINDOW_HEIGHT - 100,
            width: '100%',
          }}>
          <ActivityIndicator size="large" color="#0062FF" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Text
              style={{
                color: '#666',
                fontSize: 15,
                paddingHorizontal: 20,
                textTransform: 'capitalize',
              }}>
              {current}
            </Text>
            <TouchableOpacity
              style={{paddingHorizontal: 20, paddingVertical: 10}}
              onPress={() => {
                setDropdown(!dropdown);
              }}>
              {dropdown ? (
                <Icon name="arrow-drop-up" size={20} color="#000" />
              ) : (
                <Icon name="arrow-drop-down" size={20} color="#000" />
              )}
            </TouchableOpacity>
            {dropdown ? (
              <ScrollView style={styles.dropdown}>
                {list.map((item) => {
                  return (
                    <TouchableOpacity
                      key={item._id}
                      style={styles.dropdownTextBox}
                      onPress={() => {
                        setDropdown(false);
                        setCurrent(item.name);
                        fetchResults(item.name);
                      }}>
                      <Text style={styles.dropdownText}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 150,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {results && results.length > 0 ? (
              results.map((item, index) => {
                return <StoreCard key={index} store={item} />;
              })
            ) : (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height - 480,
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 120,
                }}>
                <Image
                  source={require('../../components/UXComponents/svg/EmptyPage.png')}
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
                  Nothing here!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Categories;
