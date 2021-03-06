import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {GlobalContext} from '../../providers/GlobalContext';

import StatusBarWhite from '../../components/StatusBar';
import StoreCard from '../../components/Cards/StoreCard/StoreCard';
import {COLORS, textStyles} from '../../styles/styles';
import {Post} from '../../api/http';

const WINDOW_HEIGHT = Dimensions.get('window').height;

import styles from './Styles';

const Favourites = (props) => {
  const {state} = useContext(GlobalContext);

  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState('all');

  useEffect(() => {
    const body = JSON.stringify({
      cred: {
        phone: state.user.phone,
      },
    });
    Post('app/favourite/all/stores', body, state.token).then((data) => {
      const favs = data.response.favouriteStores;
      console.log(data);
      setResults(favs);
      setAll(favs);
      setLoading(false);
      setCurrent('all');
      let temp = [];
      favs.forEach((fav) => {
        if (temp.indexOf(fav.business.category) === -1)
          temp.push(fav.business.category);
      });
      setCategories(temp);
    });
  }, []);

  const switchCategory = (cat) => {
    if (cat === 'all') setResults(all);
    else {
      let favs = all;
      let temp = [];
      favs.forEach((fav) => {
        if (fav.business.category === cat) temp.push(fav);
      });
      setResults(temp);
    }
  };

  const removeFavourite = (id) => {
    setResults((prev) => {
      return prev.filter((item) => item._id != id);
    });
  };

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
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Text
              style={{
                color: COLORS.SECONDARY,
                ...textStyles.paragraphMedium,
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
                <Icon name="arrow-drop-up" size={20} color={COLORS.BLACK} />
              ) : (
                <Icon name="arrow-drop-down" size={20} color={COLORS.BLACK} />
              )}
            </TouchableOpacity>
            {dropdown ? (
              <ScrollView style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownTextBox}
                  onPress={() => {
                    setDropdown(false);
                    setCurrent('all');
                    switchCategory('all');
                  }}>
                  <Text style={styles.dropdownText}>All</Text>
                </TouchableOpacity>
                {categories.map((cat) => {
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={styles.dropdownTextBox}
                      onPress={() => {
                        setDropdown(false);
                        setCurrent(cat);
                        switchCategory(cat);
                      }}>
                      <Text style={styles.dropdownText}>{cat}</Text>
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
                return (
                  <StoreCard
                    key={index}
                    store={item}
                    navigation={props.navigation}
                    favourite={true}
                    removeFavourite={removeFavourite}
                  />
                );
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

export default Favourites;
