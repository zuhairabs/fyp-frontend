import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    PixelRatio,
} from 'react-native';
import BookButton from '../UXComponents/BookButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const DEVICE_WIDTH = Dimensions.get('window').width;

const BigCard = (props) => {
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={() => {
                    props.navigation.navigate("Store", { store: props.store._id, bookSlot: false })
                }}
                style={styles.card}
                setOutlineAmbientShadowColor="#f00"
            >
                <View style={styles.cardRight}>
                    <View>
                        <Text style={styles.cardTitleSubtext}>hometown</Text>
                    </View>
                    <View style={styles.cardTitle}>
                        <Text style={styles.cardTitleText} numberOfLines={1}>
                            {props.store.business.display_name}
                        </Text>
                        <Text style={styles.cardTitleTextBlack} allowFontScaling={true} numberOfLines={1}>
                            {props.store.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate("Store", { store: props.store._id, bookSlot: true })
                        }}
                    >
                        <BookButton />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardLeft}>
                    <Image source={{
                        uri: `data:image/gif;base64,${props.store.business.images[0] || props.store.business.logo}`
                    }}
                        style={styles.cardImage}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,

        justifyContent: "center",
        alignItems: "center",

        height: 220,
        width: DEVICE_WIDTH,

    },
    card: {
        backgroundColor: "#fff",
        elevation: 8,
        borderRadius: 12,

        height: 200,
        width: DEVICE_WIDTH - 40,
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginLeft: 10,
        marginVertical: 10,
    },
    cardRight: {
        padding: 20,
        flex: 2,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        justifyContent: 'space-around',
    },
    cardTitleText: {
        color: '#1162FB',
        fontSize: 24,
        fontWeight: "bold",
        margin: 0,
        padding: 0,
        fontFamily: 'serif'
    },
    cardTitleTextBlack: {
        color: '#000',
        fontSize: 24,
        fontWeight: "bold",
        margin: 0,
        padding: 0,
        fontFamily: 'serif'
    },
    cardTitleSubtext: {
        textTransform: 'uppercase',
        fontFamily: 'notoserif',
        fontSize: 10,
    },
    bookButton: {
        backgroundColor: '#fff',
        color: '#000',
        padding: 5,
        borderBottomWidth: 2,
        borderColor: '#1162FB',
    },
    bookButtonText: {
        fontFamily: 'notoserif',
        textTransform: 'uppercase',
        fontSize: 10,
    },
    cardLeft: {
        width: '100%',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    cardImage: {
        flex: 1,
        width: "100%",
        height: undefined,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12
    },
});

export default BigCard;
