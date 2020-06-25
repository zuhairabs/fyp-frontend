import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, ActivityIndicator } from 'react-native';

import CardSmall from './CardSmall'

const CardScrollSmall = (props) => {

    const [stores, setStores] = useState(props.stores)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [props.stores])

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
                                    return <CardSmall key={store._id} store={store} navigation={props.navigation} />
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