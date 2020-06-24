import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Platform, StatusBar, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import MainBackground from '../UXComponents/MainBackground'
import StatusBarWhite from '../UXComponents/StatusBar'

import Navbar from '../Header/Navbar';
import Search from '../Header/Search';
import Location from '../Header/HeaderLocation'
import CategoryScroll from '../Header/CategoryScroll'
import CardScroll from '../CardScrollBig/CardScroll'
import CardScrollSmall from '../CardScrollSmall/CardScrollSmall'

const Home = ({ navigation }) => {

    const [location, setLocation] = useState({})

    useEffect(() => {
        const bootstrapper = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the location")
                    Geolocation.getCurrentPosition(info => {
                        let locationInfo = {
                            lat: info.coords.latitude,
                            long: info.coords.longitude
                        }
                        setLocation(locationInfo)
                    },
                    error => console.log(error),
                    {
                        timeout: 15000,
                        enableHighAccuracy: true
                    })
                } else {
                    console.log("location permission denied")
                    alert("Location permission denied");
                }
            } catch (err) {
                console.warn(err)
            }
        }
        bootstrapper();
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
                <Location location={location} />
                <CategoryScroll />
                <CardScroll />
                <Text style={styles.mainSubHeading}>Near Me</Text>
                <CardScrollSmall navigation={navigation} />
                <Text style={styles.mainSubHeading}>new onboard</Text>
                {/* <CardScrollSmall /> */}
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