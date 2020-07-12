import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'

import RatingBadge from '../Rating/RatingBadge'
import BookButton from '../UXComponents/BookButton'

const StoreCard = (props) => {

    const statusTextColor = props.status === "completed"
        ? "#1AB542" : (props.status === "cancelled"
            ? "#E50A17" : "#FCC225")

    return (
        <TouchableWithoutFeedback
            style={styles.container}
            onPress={() => {
                props.navigation.navigate("Store", { store: props.store._id })
            }}
        >
            <View style={styles.details}>
                <View style={styles.imageContainer}>
                    <Image source={{
                        uri: `data:image/gif;base64,${props.store.business.title_image || props.store.business.logo}`
                    }}
                        style={styles.image}
                    />
                    <View style={styles.imageFiller}></View>
                </View>
                <View style={styles.cardContent}>
                    <View>
                        <Text style={styles.heading}>
                            {props.store.business.display_name} {props.store.name}
                        </Text>
                        <View style={styles.subheading}>
                            <Text style={styles.subheadingText}>
                                {props.store.business.category}
                            </Text>
                            <Text style={styles.subheadingText}>
                                {props.store.name}, {props.store.location_desc}
                            </Text>
                            {
                                props.status &&
                                <Text style={{ marginTop: 5, color: statusTextColor, textTransform: "capitalize" }}>
                                    {props.status}
                                </Text>
                            }
                        </View>
                    </View>
                    {
                        props.noBookButton ? null
                            :
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate("Store", { store: props.store._id, bookSlot: true })
                            }}
                            >
                                <BookButton />
                            </TouchableOpacity>
                    }

                </View>
            </View>
            <View style={styles.rating}>
                <RatingBadge value={props.store.avg_rating || 4.5} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#ECF0F4",
        paddingBottom: 20,
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
        fontSize: 20,
        color: "#666"
    },
    subheading: {
        paddingVertical: 10,
    },
    subheadingText: {
        fontSize: 14,
        color: "#666",
        textTransform: "capitalize",
    },

})

export default StoreCard;