import React, { useEffect, useState, useContext } from 'react';
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
    Dimensions
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { TouchableHighlight } from 'react-native-gesture-handler';

import MainBackground from '../../components/Backgrounds/MainBackground'
import StatusBarWhite from '../../components/StatusBar'

import Navbar from '../../components/Header/Navbar';
import SearchBarIdle from '../../components/Header/SearchBarIdle'
import Location from '../../components/Header/HeaderLocation'
import CategoryScroll from '../../components/Header/CategoryScroll'
import CardScroll from '../../components/CardScrollBig/CardScroll'
import CardScrollSmall from '../../components/CardScrollSmall/CardScrollSmall'

import { GlobalContext } from '../../providers/GlobalContext'
import { textStyles, COLORS } from '../../styles/styles'
import { stat } from 'react-native-fs';

const DEVICE_HEIGHT = Dimensions.get("window").height;

const Home = ({ navigation }) => {
    const { state, authActions } = useContext(GlobalContext)

    const [loading, setLoading] = useState(true)
    const [locationPermissionStatus, setLocationPermissionStatus] = useState(false)

    const [categories, setCategories] = useState([])
    const [dataBigCard, setDataBigCard] = useState([])
    const [dataSmallCard, setDataSmallCard] = useState([])
    const [dataNewStores, setDataNewStores] = useState([])

    const requestLocationPermission = async () => {
        return new Promise(async (resolve, reject) => {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(info => {
                    let locationInfo = {
                        long: info.coords.longitude,
                        lat: info.coords.latitude
                    }
                    authActions.changeLocation(locationInfo.long, locationInfo.lat)
                    setLocationPermissionStatus(true);
                    resolve(locationInfo)
                },
                    error => {
                        console.log(error)
                        Alert.alert(error.message)
                        setLocationPermissionStatus(false)
                        reject();
                    },
                    {
                        timeout: 15000,
                        enableHighAccuracy: true
                    })
            } else {
                setLocationPermissionStatus(false)
                reject()
            }
        })
    }

    const getCategories = (options) => {
        try {
            fetch('https://shopout.herokuapp.com/user/home/categories', options)
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            setCategories(data.response)
                        })
                    }
                    else {
                        console.log(res.statusText)
                    }
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    const getFeaturedStores = (options, locationInfo) => {
        try {
            fetch('https://shopout.herokuapp.com/user/home/featured', options)
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            setDataBigCard(data.response)
                            getNearestStores(options, locationInfo)
                        })
                    }
                    else {
                        console.log(res.statusText)
                    }
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    const getNearestStores = (options, locationInfo) => {
        try {
            let uri = 'https://shopout.herokuapp.com/user/home/nearest';
            const lat = locationInfo.lat, long = locationInfo.long;
            if (lat && long) uri = `https://shopout.herokuapp.com/user/home/nearest?lat=${lat}&lng=${long}`

            fetch(uri, options)
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            setDataSmallCard(data.response)
                            getLatestStores(options)
                        })
                    }
                    else console.log(res.statusText)
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    const getLatestStores = (options) => {
        try {
            fetch('https://shopout.herokuapp.com/user/home/new', options)
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            setDataNewStores(data.response)
                            setLoading(false);
                        })
                    }
                    else {
                        setLoading(false);
                        console.log(res.statusText)
                    }
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    // const getStoreList = (options) => {
    //     try {
    //         fetch('https://shopout.herokuapp.com/user/home/list', options)
    //             .then(res => {
    //                 if (res.status === 200) {
    //                     res.json().then(data => {
    //                         // console.log(data)
    //                         console.log("Store list fetched")
    //                     })
    //                 }
    //                 else {
    //                     console.log(res.statusText)
    //                 }
    //             })
    //     }
    //     catch (e) {
    //         console.log("Here error")
    //         console.log(e)
    //     }
    // }

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + state.token
            },
            body: JSON.stringify({
                "cred": {
                    "phone": state.user.phone
                },
                "city": "Mumbai",
                "number": 50,
            })
        }
        requestLocationPermission()
            .then(locationInfo => {
                getFeaturedStores(requestOptions, locationInfo)
                getCategories(requestOptions)
                // getStoreList(requestOptions)
            })
    }, [])

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />
            <MainBackground />
            <ScrollView
                style={styles.container}
                stickyHeaderIndices={[1]}
                keyboardDismissMode
                maintainVisibleContentPosition
                showsVerticalScrollIndicator={false}
            >

                <Navbar type="unlocked" navigation={navigation} />
                <SearchBarIdle navigation={navigation} />

                {
                    locationPermissionStatus ? [
                        (loading ? <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: DEVICE_HEIGHT - 150,
                            padding: 20,
                        }}>
                            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                        </View> :
                            <>
                                <Location />
                                <CategoryScroll categories={categories} />
                                <CardScroll navigation={navigation} stores={dataBigCard} />
                                <Text style={styles.mainSubHeading}>Near Me</Text>
                                <CardScrollSmall navigation={navigation} stores={dataSmallCard} />
                                <Text style={styles.mainSubHeading}>new onboard</Text>
                                <CardScrollSmall navigation={navigation} stores={dataNewStores} />
                            </>
                        )]
                        : <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: DEVICE_HEIGHT - 150,
                                padding: 20,
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>
                                We need your device's location to provide you a catered experience
                            </Text>
                            <TouchableHighlight
                                onPress={() => { requestLocationPermission() }}
                                style={{
                                    backgroundColor: COLORS.PRIMARY,
                                    padding: 5,
                                    paddingHorizontal: 20,
                                    marginTop: 20,
                                    borderRadius: 15,
                                }}
                            >
                                <Text style={{ color: COLORS.WHITE, fontSize: 20 }}>
                                    Give location permission
                                </Text>
                            </TouchableHighlight>
                        </View>
                }

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: COLORS.WHITE
    },
    mainSubHeading: {
        marginHorizontal: 35,
        textTransform: "uppercase",
        color: "#666",
        ...textStyles.paragraphMediumBold
    }
});

export default Home;