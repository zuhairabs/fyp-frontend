import React, { useState, useEffect, useContext } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
    Alert,
    ActivityIndicator,
    ToastAndroid
} from 'react-native'
import { ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, FlatList } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { GlobalContext } from '../../providers/GlobalContext'

import NavbarBackButton from '../../components/Header/NavbarBackButton'
import StatusBarWhite from '../../components/StatusBar'
import MainBackground from '../../components/Backgrounds/MainBackground'
import BookSlotSlider from '../../components/BookSlotSlider/BookSlot'
import RatingBadge from '../../components/RatingBadge/RatingBadge';
import ImageHeader from './ImageHeader'
import { COLORS, textStyles } from '../../styles/styles'

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

const headerHeight = Math.floor(WINDOW_HEIGHT / 2.8)

const SafetyElement = ({ item }) => (
    <View style={styles.safetyElement}>
        <Icon name="check" size={12} color="#4DEB96" />
        <Text style={styles.safetyElementText}>
            {item.title}
        </Text>
    </View>
)

const Store = (props) => {
    const { store, searched, data } = props.route.params;
    const { state } = useContext(GlobalContext)

    const [loading, setLoading] = useState(false)
    const [storeData, setStoreData] = useState({})
    const [bookSlot, setBookSlot] = useState(props.route.params.bookSlot || false)
    const [favourite, setFavourite] = useState(false)

    useEffect(() => {
        getStoreData();
        if (searched)
            saveStoreHistory(store, state.user.phone)
        if (state.user.favouriteStores && state.user.favouriteStores.indexOf(store) > -1)
            setFavourite(true);
    }, [store, data])

    const getStoreData = () => {
        if (data)
            setStoreData(data)
        fetchMissingData();
    }

    const fetchMissingData = () => {
        fetch("https://shopout.herokuapp.com/store/fetch/details", {
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
                        setStoreData(prev => ({ ...prev, ...data.store }))
                    })
                }
                else
                    Alert.alert("Something went wrong", res.status)
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
        const addToStorage = async (favs) => {
            let user = JSON.parse(await AsyncStorage.getItem("user"));
            user.favouriteStores = favs
            user = JSON.stringify(user);
            await AsyncStorage.setItem("user", user)
        }

        if (!favourite) {

            fetch('https://shopout.herokuapp.com/user/addfavouritestore', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + state.token
                },
                body: JSON.stringify({
                    storeData: {
                        _id: store
                    },
                    cred: {
                        phone: state.user.phone
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

                            fetch('https://shopout.herokuapp.com/user/removefavouritestore', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + state.token
                                },
                                body: JSON.stringify({
                                    storeData: {
                                        _id: store
                                    },
                                    cred: {
                                        phone: state.user.phone
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

            <ScrollView style={styles.container}>
                <NavbarBackButton navigation={props.navigation} />

                <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>

                    <View style={styles.ratingBadge}>
                        <RatingBadge color="orange" value={storeData.avg_rating || false} />
                    </View>

                    {
                        storeData.business &&
                        <ImageHeader
                            height={headerHeight}
                            title_image={storeData.business.title_image || null}
                            store={store}
                        />
                    }

                    <ScrollView style={styles.storeDetails}
                        contentContainerStyle={{ justifyContent: "center", alignItems: "flex-start" }}>
                        <View style={styles.heading}>
                            <View style={styles.headingText}>
                                {
                                    storeData.business &&
                                    <Text style={textStyles.serifHeader}>
                                        {storeData.business.display_name}
                                    </Text>
                                }
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
                            {
                                storeData.parameters
                                    ? <FlatList
                                        data={storeData.parameters}
                                        renderItem={({ item }) => <SafetyElement item={item} />}
                                        numColumns={2}
                                    />
                                    : <ActivityIndicator />
                            }
                        </View>

                        <Text style={styles.subheading}>
                            Store Time
                                    </Text>
                        <View style={styles.safetyContainer}>
                            {
                                storeData.active_hours
                                    ? <View style={styles.safetyElement}>
                                        <Icon name="access-time" size={12} color="#0062FF" />
                                        <Text style={styles.safetyElementText}>
                                            {getWorkingDaysText()}
                                        </Text>
                                    </View>
                                    : <ActivityIndicator />
                            }
                        </View>

                        <View style={styles.detailsContainer}>
                            <Text style={styles.details}>
                                {
                                    storeData.description
                                        ? storeData.description
                                        : "No description available"
                                }
                            </Text>
                        </View>

                    </ScrollView>

                </View>
            </ScrollView>
            {
                bookSlot && storeData.active_hours
                    ? <BookSlotSlider setBookSlot={setBookSlot} storeData={storeData} navigation={props.navigation} />
                    : <TouchableNativeFeedback onPress={() => { setBookSlot(true) }} style={styles.button}>
                        <Text style={styles.buttonText}>BOOK SLOT</Text>
                    </TouchableNativeFeedback>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: Dimensions.get("screen").height,
        backgroundColor: COLORS.WHITE,
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
    reviewCountHeading: {
        color: COLORS.SECONDARY,
        textDecorationLine: "underline",
        ...textStyles.paragraphSmallBold
    },
    headingRight: {
        justifyContent: "center",
        alignItems: "center"
    },
    favouriteIcon: {
        marginBottom: 10,
        elevation: 5,
        backgroundColor: COLORS.WHITE,
        padding: 10,
        borderRadius: 40 / 2,
    },
    location: {
        marginTop: 10,
        color: COLORS.SECONDARY,
        ...textStyles.paragraphSmallBold
    },
    subheading: {
        marginTop: 20,
        ...textStyles.paragraphLargeBold
    },
    safetyContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 10,
    },
    safetyElement: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginTop: 10,
    },
    safetyElementText: {
        marginLeft: 5,
        color: COLORS.SECONDARY,
        ...textStyles.paragraphSmallBold
    },
    detailsContainer: {
        marginTop: 30,
    },
    details: {
        ...textStyles.paragraphMedium
    },
    button: {
        position: "relative",
        zIndex: 2,
        top: 0,
        width: WINDOW_WIDTH,
        height: Math.floor(WINDOW_HEIGHT / 20),
        backgroundColor: COLORS.PRIMARY,
        alignItems: "center",
        justifyContent: "flex-end",
        padding: NAVIGATION_HEIGHT > 0 ? 30 : 40,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        marginBottom: DEVICE_HEIGHT - WINDOW_HEIGHT - 30
    },
    buttonText: {
        ...textStyles.primaryButtonText
    }
})

export default Store

const saveStoreHistory = (store, phone) => {
    fetch("https://shopout.herokuapp.com/user/store/history/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            storeData: store,
            cred: {
                phone: phone
            }
        })
    })
        .catch(e => {
            console.log(e)
        })
}

