import React from 'react'
import { Text, View, StyleSheet, Image, ToastAndroid, Alert } from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import RatingBadge from '../../RatingBadge/RatingBadge'
import BookButton from '../../Buttons/BookButton'
import { COLORS, textStyles } from '../../../styles/styles'

const StoreCard = (props) => {
    const removeFavourite = () => {
        const bootstrapper = async () => {
            let user = JSON.parse(await AsyncStorage.getItem("user"));
            let token = await AsyncStorage.getItem("jwt");

            return { user, token }
        }
        const updateAsyncStorage = async (favs) => {
            let user = JSON.parse(await AsyncStorage.getItem("user"));
            user.favouriteStores = favs
            user = JSON.stringify(user);
            await AsyncStorage.setItem("user", user)
        }

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
                                        _id: props.store._id
                                    },
                                    cred: {
                                        phone: user.phone
                                    }
                                })
                            }).then(res => {
                                if (res.status === 200) {
                                    ToastAndroid.show("Removed from favourites", ToastAndroid.SHORT)
                                    res.json().then(data => {
                                        updateAsyncStorage(data.favouriteStores)
                                        props.removeFavourite(props.store._id)
                                    })
                                }
                                else ToastAndroid.show("Unable to remove favourite", ToastAndroid.SHORT)
                            })
                        })
                    },
                    style: "default"
                }
            ]
        )
    }


    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate("Store", {
                            store: props.store._id,
                            data: props.store,
                            searched: props.searched ? true : false
                        })
                    }}
                    style={styles.imageContainer}
                >
                    <Image source={{
                        uri: `data:image/gif;base64,${props.store.business.title_image || props.store.business.logo}`
                    }}
                        style={styles.image}
                    />
                    <View style={styles.imageFiller}></View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => {
                        props.navigation.navigate("Store", {
                            store: props.store._id,
                            data: props.store,
                            searched: props.searched ? true : false
                        })
                    }}
                >
                    <View>
                        <Text
                            style={styles.heading}
                            numberOfLines={1}
                        >
                            {props.store.business.display_name} {props.store.name}
                        </Text>
                        <View style={styles.subheading}>
                            <Text style={styles.subheadingText}>
                                {props.store.business.category}
                            </Text>
                            <Text style={styles.subheadingText}>
                                {props.store.name}, {props.store.location_desc}
                            </Text>
                        </View>
                    </View>
                    {
                        props.noBookButton ? null
                            :
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("Store", {
                                    store: props.store._id,
                                    data: props.store,
                                    bookSlot: true
                                })
                            }}
                            >
                                <BookButton />
                            </TouchableOpacity>
                    }

                </TouchableOpacity>
            </View>
            <View style={styles.rating}>
                {
                    props.favourite ?
                        <TouchableWithoutFeedback
                            onPress={() => { removeFavourite() }}
                            style={styles.favouriteIcon}
                        >
                            <Icon name="favorite" size={16} color={COLORS.RED} />
                        </TouchableWithoutFeedback>
                        :
                        <RatingBadge value={props.store.avg_rating || 4.5} />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: COLORS.BORDER_LIGHT,
        paddingVertical: 10,
    },
    rating: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    details: {
        flex: 7,
        flexDirection: "row"
    },
    imageContainer: {
        flex: 2,
        justifyContent: "space-around",
        width: 80,
        borderRadius: 6
    },
    imageFiller: {
        flex: 1,
    },
    image: {
        height: undefined,
        width: undefined,
        flex: 4,
        borderRadius: 6,
        resizeMode: "contain",
    },
    cardContent: {
        flex: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    heading: {
        ...textStyles.paragraphLarge,
        color: COLORS.SECONDARY,
    },
    subheading: {
        paddingVertical: 10,
    },
    subheadingText: {
        ...textStyles.paragraphSmall,
        color: COLORS.SECONDARY,
        textTransform: "capitalize",
    },
    favouriteIcon: {
        elevation: 5,
        backgroundColor: COLORS.WHITE,
        padding: 10,
        borderRadius: 40 / 2,
        zIndex: 2,
    },
})

export default StoreCard;