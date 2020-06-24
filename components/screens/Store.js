import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, Image, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'


import NavbarBackButton from '../Header/NavbarBackButton'
import StatusBarWhite from '../UXComponents/StatusBar'
import RatingBadge from '../Rating/RatingBadge'
import MainBackground from '../UXComponents/MainBackground'
import BookSlot from '../UXComponents/BookSlot'

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const DEVICE_WIDTH = Dimensions.get('screen').width;

const Store = (props) => {

    const { store } = props.route.params;
    const [loading, setLoading] = useState(true)
    const [storeData, setStoreData] = useState({})
    const [headerImage, setHeaderImage] = useState("")
    const [images, setImages] = useState([])
    const [bookSlot, setBookSlot] = useState(props.bookSlot || false)

    useEffect(() => {
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
                        setImages([data.store.business.logo, data.store.business.logo, data.store.business.logo, data.store.business.logo])
                        setHeaderImage(data.store.business.logo)
                        setLoading(false)
                    })
                }
                else
                    Alert.alert("Something went wrong", res.status)
            })
    }, [store])

    const changeImage = (image) => {
        setHeaderImage(image)
    }

    return (
        <View style={styles.screenContainer}>
            <MainBackground />
            <StatusBarWhite />

            {
                loading
                    ? <ActivityIndicator size="large" color="#0062FF" />
                    : [
                        (<ScrollView
                            style={styles.container}
                        // stickyHeaderIndices={[0]}
                        >
                            <NavbarBackButton navigation={props.navigation} />
                            <View style={styles.contentContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>

                                <View style={styles.headerImageContainer}>
                                    <View style={styles.ratingBadge}>
                                        <RatingBadge color="orange" value={storeData.avg_rating || (Math.floor(Math.random() * 4 * 10) / 10) + 1} />
                                    </View>
                                    <Image source={{ uri: `data:image/gif;base64,${headerImage}` }} style={styles.headerImage} />
                                </View>
                                <View style={styles.carousel}>
                                    {
                                        images.map(img => {
                                            return <View style={styles.carouselImageContainer}>
                                                <TouchableOpacity
                                                    style={styles.carouselTouchable}
                                                    onPress={() => {
                                                        changeImage(img)
                                                    }}
                                                >
                                                    <Image source={{ uri: `data:image/gif;base64,${img}` }} style={styles.carouselImage} />
                                                </TouchableOpacity>
                                            </View>
                                        })
                                    }
                                </View>
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
                                            <TouchableWithoutFeedback style={styles.favouriteIcon}>
                                                <Icon name="favorite-border" size={16} color="#F30302" />
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
                                                Monday to Friday {storeData.active_hours[0].start} to {storeData.active_hours[0].end}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.details}>
                                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                                        </Text>
                                    </View>

                                </ScrollView>

                            </View>
                        </ScrollView>),
                        (
                            bookSlot
                                ? <BookSlot setBookSlot={setBookSlot} storeData={storeData} />
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
        height: DEVICE_HEIGHT,
        backgroundColor: "#fff",
        justifyContent: "center"
    },
    container: {
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    headerImageContainer: {
        height: Math.floor(DEVICE_HEIGHT / 3.4),
        width: "100%",
        borderWidth: 1,
        borderColor: "#66666617"
    },
    headerImage: {
        height: undefined,
        width: undefined,
        flex: 1,
        resizeMode: "contain"
    },
    ratingBadge: {
        position: "absolute",
        right: Math.floor((DEVICE_WIDTH / 25)),
        top: -Math.floor(DEVICE_HEIGHT / 40),
        zIndex: 2,
    },
    carousel: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: Math.floor(DEVICE_HEIGHT / 9),
        marginTop: 20,
    },
    carouselImageContainer: {
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "#66666666",
        borderRadius: 15,
        flex: 1,
    },
    carouselTouchable: {
        height: "100%"
    },
    carouselImageSelected: {
        width: undefined,
        height: undefined,
        flex: 1,
        resizeMode: "contain",
        borderRadius: 15
    },
    carouselImage: {
        width: undefined,
        height: undefined,
        flex: 1,
        resizeMode: "contain",
        opacity: 0.3,
        borderRadius: 15
    },
    storeDetails: {
        marginTop: 30,
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 30,
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
        bottom: 0,
        width: DEVICE_WIDTH,
        height: Math.floor(DEVICE_HEIGHT / 20),
        backgroundColor: "#0062FF",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    buttonText: {
        color: "#fff"
    }
})

export default Store