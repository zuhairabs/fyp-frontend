import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import RatingBadge from '../Rating/RatingBadge'
import BookButton from '../UXComponents/BookButton'

const StoreCard = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `data:image/gif;base64,${props.store.business.logo}` }} style={styles.image} />
                    {/* <Image source={require('./store.png')} style={styles.image} /> */}
                    <View style={styles.imageFiller}></View>
                </View>
                <View style={styles.cardContent}>
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
                    </View>
                    {
                        props.noBookButton ? null
                            :
                            <TouchableOpacity onPress={() => { props.navigation.navigate("Store", { store: props.store._id }) }}>
                                <BookButton />
                            </TouchableOpacity>
                    }

                </View>
            </View>
            <View style={styles.rating}>
                <RatingBadge value={props.store.avg_rating || 4.5} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#ECF0F4",
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