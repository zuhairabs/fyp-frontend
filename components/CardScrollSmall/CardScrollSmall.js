import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, ActivityIndicator } from 'react-native';

import CardSmall from './CardSmall'

const CardScrollSmall = ({ navigation }) => {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("https://shopout.herokuapp.com/store/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json()
                        .then((result) => {
                            setStores(result.stores);
                            setLoading(false);
                        })
                }
                else
                    console.log("Can't load stores, error: ", res.status)
            })

            .catch(error => {
                console.debug("Something went wrong")
            })
    }, [])

    return (
        <View style={styles.container}>
            {
                loading ? 
                    <ActivityIndicator size="large" color="#0062FF"/>
                : (
                        <ScrollView
                            horizontal
                        // showsHorizontalScrollIndicator={false}
                        >
                            {
                                stores.map(store => {
                                    return <CardSmall key={store._id} store={store} navigation={navigation} />
                                })
                            }
                        </ScrollView>
                    )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingLeft: 20,
        height: 320,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CardScrollSmall;