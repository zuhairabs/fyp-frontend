import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import RatingBadge from '../Rating/RatingBadge'
import BookButton from '../UXComponents/BookButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const DEVICE_WIDTH = Dimensions.get('window').width;

const CardSmall = ({ store, navigation }) => {
    return (
        <View style={styles.container}>

            <View style={styles.card}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.navigate("Store", { store: store._id })
                    }}
                >
                    <View style={styles.cardHeader}>
                        {/* <Image source={require('./cafe.png')} style={styles.cardImage} /> */}
                        <Image source={{
                            uri: `data:image/gif;base64,${store.business.title_image || store.business.logo}`
                        }}
                            style={styles.cardImage} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{store.business.display_name}</Text>
                        <Text style={styles.cardTitle}>{store.name}</Text>
                        <View style={styles.cardSubtitle}>
                            <Icon name="location-on" size={10} color='#666' />

                            <Text style={styles.cardSubtitleText} numberOfLines={1}>
                                {store.location_desc}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => { navigation.navigate("Store", { store: store._id, bookSlot: true }) }}>
                            <BookButton />
                        </TouchableOpacity>
                    </View>

                </TouchableWithoutFeedback>
                <View style={styles.ratingBadge}>
                    <RatingBadge value={store.avg_rating || (Math.floor(Math.random() * 4 * 10) / 10) + 1} />
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Math.floor(DEVICE_WIDTH / 2.6),
        marginVertical: 10,
        marginLeft: 5,
        marginRight: 20,
    },
    card: {
        height: 280,
        backgroundColor: "#fff",
        justifyContent: "flex-start",

        elevation: 5,
        borderRadius: 15,
    },
    cardContent: {
        padding: 15,
        height: 140,
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "serif",
    },
    cardSubtitle: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    cardSubtitleText: {
        color: "#666",
        fontSize: 10,
        flexWrap: "wrap",
        flexDirection: "row",
    },
    cardHeader: {
        width: "100%",
        height: 140,
    },
    cardImage: {
        width: undefined,
        height: undefined,
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    ratingBadge: {
        position: "absolute",
        bottom: 0,
        // right: -Math.floor(DEVICE_WIDTH/2.6),
        right: "-12%",
        bottom: "-6%",
        elevation: 5,
    }
})

export default CardSmall;
