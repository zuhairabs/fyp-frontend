import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Platform, StatusBar, PermissionsAndroid, Alert, ActivityIndicator, Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage'

import MainBackground from '../UXComponents/MainBackground'
import StatusBarWhite from '../UXComponents/StatusBar'

import Navbar from '../Header/Navbar';
import Search from '../Header/Search';
import Location from '../Header/HeaderLocation'
import CategoryScroll from '../Header/CategoryScroll'
import CardScroll from '../CardScrollBig/CardScroll'
import CardScrollSmall from '../CardScrollSmall/CardScrollSmall'
import { TouchableHighlight } from 'react-native-gesture-handler';

const DEVICE_HEIGHT = Dimensions.get("window").height;

const Home = ({ navigation }) => {

    const [location, setLocation] = useState({})
    const [loading, setLoading] = useState(true)
    const [locationPermissionStatus, setLocationPermissionStatus] = useState(false)

    const [categories, setCategories] = useState([])
    const [dataBigCard, setDataBigCard] = useState([])
    const [dataSmallCard, setDataSmallCard] = useState([])
    const [dataNewStores, setDataNewStores] = useState([])

    const locationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
                setLocationPermissionStatus(true);
                Geolocation.getCurrentPosition(info => {
                    let locationInfo = {
                        lat: info.coords.latitude,
                        long: info.coords.longitude
                    }
                    setLocation(locationInfo)
                },
                    error => {
                        console.log(error)
                        Alert.alert(error.message)
                        setLocationPermissionStatus(false)
                    },
                    {
                        timeout: 15000,
                        enableHighAccuracy: true
                    })
            } else {
                console.log("location permission denied")
                // alert("Location permission denied");
                setLocationPermissionStatus(false)
            }
        } catch (err) {
            console.warn(err)
        }
    }

    useEffect(() => {
        locationPermission();

        const getUserFromStorage = async () => {
            const user = JSON.parse(await AsyncStorage.getItem("user"))
            const token = await AsyncStorage.getItem("jwt")
            return { user, token }
        }

        getUserFromStorage().then(({ user, token }) => {
            console.log({ user, token })
            try {
                fetch('https://shopout.herokuapp.com/user/home', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        "cred": {
                            "phone": user.phone
                        },
                        "city": "Mumbai"
                    })
                })
                    .then(res => {
                        if (res.status === 200)
                            res.json().then(data => {
                                setCategories(data.category)
                                setDataBigCard(data.stores.slice(0, 5))
                                setDataSmallCard(data.stores.slice(5))
                                setDataNewStores(data.recentStores)
                                setLoading(false);
                            })
                        else
                            console.log(res.statusText)
                    })
            }
            catch (e) {
                console.log(e)
                Alert.alert("Something went wrong")
            }
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
                <Search navigation={navigation} />

                {
                    locationPermissionStatus ? [
                        (loading ? <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: DEVICE_HEIGHT - 150,
                            padding: 20,
                        }}>
                            <ActivityIndicator size="large" color="#0062FF" />
                        </View> :
                            <>
                                <Location location={location} />
                                <CategoryScroll categories={categories}/>
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
                                onPress={() => { locationPermission() }}
                                style={{
                                    backgroundColor: "#0062FF",
                                    padding: 5,
                                    paddingHorizontal: 20,
                                    marginTop: 20,
                                    borderRadius: 15,
                                }}
                            >
                                <Text style={{ color: "#fff", fontSize: 20 }}>
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
        backgroundColor: "#fff"
    },
    mainSubHeading: {
        marginHorizontal: 35,
        textTransform: "uppercase",
        fontSize: 16,
        color: "#666"
    }
});

export default Home;