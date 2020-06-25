import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View, FlatList, ActivityIndicator } from 'react-native';

import BigCard from './BigCard'

const CardScroll = (props) => {

    const [stores, setStore] = useState(props.stores)
    const [loading, setLoading] = useState([])

    useEffect(() => {
        setLoading(false)
    }, [props.stores])

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {
                    loading ? <View style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                        : [
                            (
                                stores.map(store => {
                                    return <BigCard key={store._id} store={store} navigation={props.navigation} />
                                })
                            )
                        ]
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 400,
        width: "100%",
        marginVertical: 5,
    }
});

export default CardScroll;