import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Alert, ActivityIndicator, ToastAndroid } from 'react-native'
import { ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'


import NavbarBackButton from '../../Header/NavbarBackButton'
import StatusBarWhite from '../../UXComponents/StatusBar'
import MainBackground from '../../UXComponents/MainBackground'
import BookSlot from '../../UXComponents/BookSlot'
import RatingBadge from '../../Rating/RatingBadge';
import ImageHeader from './ImageHeader'

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;
const NAVIGATION_HEIGHT = DEVICE_HEIGHT - WINDOW_HEIGHT - (StatusBar.currentHeight || 0);

const dayList = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
]

const Store = (props) => {
    const { store } = props.route.params;

    const [loading, setLoading] = useState(true)
    const [storeData, setStoreData] = useState({})


    const [images, setImages] = useState([])
    const [headerHeight, setHeaderHeight] = useState(Math.floor(WINDOW_HEIGHT / 2.8))

    const [bookSlot, setBookSlot] = useState(props.route.params.bookSlot || false)
    const [favourite, setFavourite] = useState(false)

    useEffect(() => {
        const checkFavourite = async () => {
            let user = JSON.parse(await (AsyncStorage.getItem("user")))
            saveStoreHistory(user.phone)
            if (user.favouriteStores && user.favouriteStores.indexOf(store) > -1) setFavourite(true);
        }
        checkFavourite().then(
            fetch("https://shopout.herokuapp.com/store/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storeData: {
                        _id: store
                    }
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            setStoreData(data.store)
                            setImages(data.store.business.images)
                            setLoading(false)
                        })
                    }
                    else
                        Alert.alert("Something went wrong", res.status)
                }))
    }, [store])

    const saveStoreHistory = (phone) => {
        fetch("https://shopout.herokuapp.com/user/store/history/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                storeData: storeData._id,
                cred: {
                    phone: phone
                }
            })
        })
            .then(res => {
                if (res.status === 200) console.log("Store history saved")
                else console.log("Unable to save history")
            })
            .catch(e => {
                console.log(e)
            })
    }


    const getWorkingDaysText = () => {
        const working_days = storeData.working_days
        if (working_days && working_days.length > 0) {
            if (working_days.length === 7) return `Open all days ${storeData.active_hours[0].start} to ${storeData.active_hours[0].end}`
            if (working_days.length === 6) {
                let offDay = '';
                for (let i = 0; i < 7; ++i)
                    if (working_days.indexOf(i) === -1) {
                        offDay = dayList[i]
                        break
                    }
                return `Daily ${storeData.active_hours[0].start} to ${storeData.active_hours[0].end}, ${offDay} closed`
            }
            else {
                let string = ""
                for (let i = 0; i < 7; ++i)
                    if (working_days.indexOf(i) > -1)
                        string = string + dayList[i] + ", "
                return `${string} ${storeData.active_hours[0].start} to ${storeData.active_hours[0].end}`
            }
        }
        else return `Open all days ${storeData.active_hours[0].start} to ${storeData.active_hours[0].end}`
    }

    const toggleFavourite = () => {
        const bootstrapper = async () => {
            let user = JSON.parse(await AsyncStorage.getItem("user"));
            let token = await AsyncStorage.getItem("jwt");

            return { user, token }
        }
        const addToStorage = async (favs) => {
            let user = JSON.parse(await AsyncStorage.getItem("user"));
            user.favouriteStores = favs
            user = JSON.stringify(user);
            await AsyncStorage.setItem("user", user)
        }

        if (!favourite) {
            bootstrapper().then(({ user, token }) => {
                fetch('https://shopout.herokuapp.com/user/addfavouritestore', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        storeData: {
                            _id: store
                        },
                        cred: {
                            phone: user.phone
                        }
                    })
                }).then(res => {
                    if (res.status === 200) {
                        ToastAndroid.show("Added to favourites", ToastAndroid.SHORT)
                        res.json().then(data => {
                            addToStorage(data.favouriteStores)
                            setFavourite(true)
                        })
                    }
                    else
                        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
                })
            })
        }
        else {
            Alert.alert(
                "Do you want to remove the store from your favourites?",
                "",
                [
                    {
                        text: "NO",
                        onPress: () => { },
                        style: "cancel"
                    },
                    {
                        text: "YES",
                        onPress: () => {
                            bootstrapper().then(({ user, token }) => {
                                fetch('https://shopout.herokuapp.com/user/removefavouritestore', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer " + token
                                    },
                                    body: JSON.stringify({
                                        storeData: {
                                            _id: store
                                        },
                                        cred: {
                                            phone: user.phone
                                        }
                                    })
                                }).then(res => {
                                    if (res.status === 200) {
                                        ToastAndroid.show("Removed from favourites", ToastAndroid.SHORT)
                                        res.json().then(data => {
                                            addToStorage(data.favouriteStores)
                                            setFavourite(false);
                                        })
                                    }
                                    else
                                        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
                                })
                            })
                        },
                        style: "default"
                    }
                ]
            )
        }
    }

    return (
        <View style={styles.screenContainer}>
            <MainBackground />
            <StatusBarWhite />
            <NavbarBackButton navigation={props.navigation} />


            {
                loading
                    ? <View
                        style={{
                            height: DEVICE_HEIGHT - StatusBar.currentHeight - 50,
                            justifyContent: "center",
                            alignItems: "center"
                        }} >
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                    : [
                        (<ScrollView style={styles.container}>

                            <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>

                                <View style={styles.ratingBadge}>
                                    <RatingBadge color="orange" value={storeData.avg_rating} />
                                </View>

                                <ImageHeader
                                    images={images}
                                    height={headerHeight}
                                />

                                <ScrollView style={styles.storeDetails}
                                    contentContainerStyle={{ justifyContent: "center", alignItems: "flex-start" }}>
                                    <View style={styles.heading}>
                                        <View style={styles.headingText}>
                                            <Text style={styles.storeName}>
                                                {storeData.business.display_name}
                                            </Text>
                                            {
                                                storeData.name === storeData.location_desc
                                                    ? <Text style={styles.location}>{storeData.name}</Text>
                                                    : <Text style={styles.location}>
                                                        {storeData.name}, {storeData.location_desc}
                                                    </Text>
                                            }
                                        </View>
                                        <View style={styles.headingRight}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    toggleFavourite()
                                                }}
                                                style={styles.favouriteIcon}
                                            >
                                                {
                                                    favourite ? <Icon name="favorite" size={16} color="#F30302" />
                                                        : <Icon name="favorite-border" size={16} color="#F30302" />

                                                }
                                            </TouchableWithoutFeedback>
                                            <Text style={styles.reviewCountHeading}>45 Reviews</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.subheading}>
                                        Safety First
                                    </Text>
                                    <View style={styles.safetyContainer}>
                                        <View style={styles.safetyElement}>
                                            <Icon name="check" size={12} color="#4DEB96" />
                                            <Text style={styles.safetyElementText}>Sanitized Environment</Text>
                                        </View>
                                        <View style={styles.safetyElement}>
                                            <Icon name="check" size={12} color="#4DEB96" />
                                            <Text style={styles.safetyElementText}>Trained Staff</Text>
                                        </View>
                                    </View>
                                    <View style={styles.safetyContainer}>
                                        <View style={styles.safetyElement}>
                                            <Icon name="check" size={12} color="#4DEB96" />
                                            <Text style={styles.safetyElementText}>Safe Practices</Text>
                                        </View>
                                        <View style={styles.safetyElement}>
                                            <Icon name="check" size={12} color="#4DEB96" />
                                            <Text style={styles.safetyElementText}>Temperature Checks Daily</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.subheading}>
                                        Store Time
                                    </Text>
                                    <View style={styles.safetyContainer}>
                                        <View style={styles.safetyElement}>
                                            <Icon name="access-time" size={12} color="#0062FF" />
                                            <Text style={styles.safetyElementText}>
                                                {getWorkingDaysText()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.details}>
                                            {
                                                storeData.description ?
                                                    storeData.description
                                                    : <Text style={{ color: "#666" }}>
                                                        No description available
                                                        </Text>
                                            }
                                        </Text>
                                    </View>

                                </ScrollView>

                            </View>
                        </ScrollView>),
                        (
                            bookSlot
                                ? <BookSlot setBookSlot={setBookSlot} storeData={storeData} navigation={props.navigation} />
                                : <TouchableNativeFeedback onPress={() => { setBookSlot(true) }} style={styles.button}>
                                    <Text style={styles.buttonText}>BOOK SLOT</Text>
                                </TouchableNativeFeedback>
                        )
                    ]
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        // backgroundColor: "#F8F9FD",
        height: Dimensions.get("screen").height,
        backgroundColor: "#fff",
        justifyContent: "center"
    },
    container: {
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FEFEFE6F",
        marginTop: 20,
    },
    ratingBadge: {
        position: "absolute",
        right: Math.floor((WINDOW_WIDTH / 25)),
        top: -Math.floor(WINDOW_HEIGHT / 40),
        zIndex: 2,
        elevation: 2,
    },
    storeDetails: {
        marginTop: 30,
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 50,
    },
    heading: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    headingText: {
        justifyContent: "center",
    },
    storeName: {
        fontSize: 26,
        fontWeight: "bold",
        fontFamily: "serif",
    },
    reviewCountHeading: {
        color: "#666",
        fontSize: 12,
        textDecorationLine: "underline",
    },
    headingRight: {
        justifyContent: "center",
        alignItems: "center"
    },
    favouriteIcon: {
        marginBottom: 10,
        elevation: 5,
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 40 / 2,
    },
    location: {
        marginTop: 10,
        fontSize: 12,
        color: "#666",
    },
    subheading: {
        marginTop: 20,
        fontSize: 20,
    },
    safetyContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    safetyElement: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    safetyElementText: {
        marginLeft: 5,
        fontSize: 12,
        color: "#666"
    },
    detailsContainer: {
        marginTop: 30,
        fontSize: 16,
    },
    button: {
        position: "relative",
        zIndex: 2,
        top: 0,
        width: WINDOW_WIDTH,
        height: Math.floor(WINDOW_HEIGHT / 20),
        backgroundColor: "#0062FF",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: NAVIGATION_HEIGHT > 0 ? 30 : 40,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginBottom: DEVICE_HEIGHT - WINDOW_HEIGHT - 30
    },
    buttonText: {
        color: "#fff"
    }
})

export default Store