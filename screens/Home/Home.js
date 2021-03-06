import React, {useEffect, useState, useContext, lazy, Suspense} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Platform,
  StatusBar,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {TouchableHighlight} from 'react-native-gesture-handler';
import OverlayPermissionModule from "rn-android-overlay-permission";

import MainBackground from '../../components/Backgrounds/MainBackground';
import StatusBarWhite from '../../components/StatusBar';
import Navbar from '../../components/Header/Navbar';
import SearchBarIdle from '../../components/Header/SearchBarIdle';
import Location from '../../components/Header/HeaderLocation';
import CardScroll from '../../components/CardScrollBig/CardScroll';
const CardScrollSmall = lazy(() =>
  import('../../components/CardScrollSmall/CardScrollSmall'),
);
const CategoryScroll = lazy(() =>
  import('../../components/Header/CategoryScroll'),
);

import {GlobalContext} from '../../providers/GlobalContext';
import {textStyles, COLORS} from '../../styles/styles';
import {Post} from '../../api/http';
import {PostBaseRoute} from '../../api/http';

const DEVICE_HEIGHT = Dimensions.get('window').height;

const Home = ({navigation}) => {
  const {authActions} = useContext(GlobalContext);

  const [location, setLocation] = useState({});
  const [locationPermissionStatus, setLocationPermissionStatus] = useState(
    false,
  );
  const [dataList, setDataList] = useState([]);

  const [offset, setOffset] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

	const requestOverlayPermission = () => {
		if (Platform.OS === "android") {
	OverlayPermissionModule.isRequestOverlayPermissionGranted((status: false) => {
    if (status) {
      Alert.alert(
        "Permissions",
        "Overlay Permission",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => OverlayPermissionModule.requestOverlayPermission(),
          },
        ],
        { cancelable: false }
      );
    }
  });
}
	}

  /* const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED)
      Geolocation.getCurrentPosition(
        (info) => {
          let locationInfo = {
            long: info.coords.longitude,
            lat: info.coords.latitude,
          };
          setLocation(locationInfo);
          authActions.changeLocation(locationInfo.long, locationInfo.lat);
          setLocationPermissionStatus(true);
        },
        (error) => {
          Alert.alert(error.message);
          setLocationPermissionStatus(false);
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
        },
      );
    else setLocationPermissionStatus(false);
  }; */

  const getCategories = () => {
    return new Promise((resolve, reject) => {
      Post('app/home/store/category/list').then(
        (data) => {
          resolve(data.response);
		  console.log(data);
        },
        (e) => {
          reject(e);
        },
      );
    });
  };

  useEffect(() => {
	OverlayPermissionModule.requestOverlayPermission();
    requestLocationPermission();
    getCategories().then((response) => {
      setCategoryList(response);
      let res = [];
      response.forEach((element) => {
        res.push({
          title: element.name,
          uri: 'app/home/store/category/single',
          category: element.name,
        });
      });
      setCategories(res);
      setDataList([res[0]]);
      setOffset(1);
    });
  }, []);

  const onListEnd = () => {
    if (offset < categories.length - 1) {
      setDataList((prev) => [...prev, categories[offset + 1]]);
      setOffset((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />
      <MainBackground />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        keyboardDismissMode
        maintainVisibleContentPosition
        showsVerticalScrollIndicator={false}>
        <Navbar type="unlocked" navigation={navigation} />
        <SearchBarIdle navigation={navigation} />

        {locationPermissionStatus ? (
          <>
            <Location location={location} />
            <Suspense fallback={<ActivityIndicator />}>
              <CategoryScroll categories={categoryList} />
            </Suspense>
            <CardScroll />
            <Suspense fallback={<ActivityIndicator />}>
              <CardScrollSmall
                item={{
                  title: 'featured videos',
                  uri: 'app/home/video/featured',
                }}
                videos={true}
              />
            </Suspense>
            <Suspense fallback={<ActivityIndicator />}>
              <CardScrollSmall
                item={{title: 'near me', uri: 'app/home/store/nearest'}}
                location={location}
              />
            </Suspense>
            <Suspense fallback={<ActivityIndicator />}>
              <CardScrollSmall
                item={{title: 'new onboard', uri: 'app/home/store/new'}}
              />
            </Suspense>
            <FlatList
              onEndReached={onListEnd}
              onEndReachedThreshold={0.2}
              data={dataList}
              renderItem={({item}) => (
                <Suspense fallback={<ActivityIndicator />}>
                  <CardScrollSmall
                    item={item}
                    category={item.category}
                    location={location}
                  />
                </Suspense>
              )}
            />
          </>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: DEVICE_HEIGHT - 150,
              padding: 20,
            }}>
            <Text style={{fontSize: 20}}>
              We need your device's location to provide you a catered experience
            </Text>
            <TouchableHighlight
              onPress={() => {
                requestLocationPermission();
              }}
              style={{
                backgroundColor: COLORS.PRIMARY,
                padding: 5,
                paddingHorizontal: 20,
                marginTop: 20,
                borderRadius: 15,
              }}>
              <Text style={{color: COLORS.WHITE, fontSize: 20}}>
                Give location permission
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.WHITE,
  },
  mainSubHeading: {
    marginHorizontal: 35,
    textTransform: 'uppercase',
    color: '#666',
    ...textStyles.paragraphMediumBold,
  },
});

export default Home;
